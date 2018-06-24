# coding: utf-8

import random
import time

from urllib.request import urlopen
from bs4 import BeautifulSoup

from entity.stock_trade_seat import StockTradeSeat
from entity.stock_trade_info import StockTradeInfo

SZ_HOST = "http://www.szse.cn"
SZ_TRADE_LIST_URL = SZ_HOST + "/szseWeb/FrontController.szse?ACTIONID=7&AJAX=AJAX-TRUE&CATALOGID=1842_xxpl&TABKEY=tab1"


STOCK_LIST_KEY = "STOCK_LIST_KEY"
PAGE_COUNT_KEY = "PAGE_COUNT_KEY"
RECORD_COUNT_KEY = "RECORD_COUNT_KEY"


def query_stock_list(start_date, end_date):
    """查询指定日期内上榜的股票"""
    query_data = query_stock_list_data(start_date, end_date, 1, 0, 0)
    page_count = int(query_data[PAGE_COUNT_KEY])

    # 根据总页数判断查询是否有数据，有的话循环查询后面页数的数据
    if page_count > 0:
        stock_list: list = query_data[STOCK_LIST_KEY]

        for page_num in range(page_count):
            page_num += 1

            if page_num > 1:
                query_data = query_stock_list_data(start_date, start_date, page_num, page_count, 0)
                stock_list.extend(query_data[STOCK_LIST_KEY])

        return stock_list
    else:
        return []


def query_stock_list_data(start_date, end_date, page_num, page_count, record_count):
    """查询全部上榜的股票，返回一个字典对象，其中包含了总页数、以及当前页数下的股票列表"""
    random_num = random.random()

    url = SZ_TRADE_LIST_URL + "&randnum=" + str(random_num) \
        + "&txtStart=" + start_date + "&txtEnd=" + end_date \
        + "&tab1PAGENO=" + str(page_num)

    # 如果查询的非第一页，还需要提供总页数、总记录数两个参数
    if page_num > 1:
        url = url + "&tab1PAGECOUNT=" + str(page_count) \
            + "&tab1RECORDCOUNT=" + str(record_count)

    html = urlopen(url)
    soup = BeautifulSoup(html.read().decode("gbk").encode("utf-8"), "html.parser")

    if len(soup.td.contents) == 3:
        return {PAGE_COUNT_KEY: 0}
    else:
        tables = soup.td.contents

        page_count = parse_page_count(tables[3])
        stock_list = parse_stock_list(tables[2])

        print(stock_list)

        return {STOCK_LIST_KEY: stock_list, PAGE_COUNT_KEY: page_count}


def query_stock_trade_detail_data(trade_detail_url, stock_trade_info):
    """查询交易详情数据，即交易某支股票的全部席位"""
    html = urlopen(trade_detail_url)
    soup = BeautifulSoup(html.read().decode("gbk").encode("utf-8"), "html.parser")
    seats_soup = soup.find(id="REPORTID_tab2").contents[1:]

    seats = []
    for seat_soup in seats_soup:
        seat = StockTradeSeat(seat_soup.contents[0].string, seat_soup.contents[1].string,
                              seat_soup.contents[2].string, seat_soup.contents[3].string,
                              stock_trade_info)
        seats.append(seat)

    return seats


def parse_page_count(page_data_soup):
    """解析出总页数"""
    s_page_count = page_data_soup.tr.contents[0].string
    page_count = s_page_count[s_page_count.index("共") + 1:len(s_page_count) - 1]

    return page_count


def parse_stock_list(stock_trade_data_soup):
    """解析出上榜的股票列表"""
    stock_soups = stock_trade_data_soup.contents[1:]

    stock_trade_info_list = []

    for stock_soup in stock_soups:
        rows = stock_soup.contents
        stock_trade_info = StockTradeInfo(rows[1].string, rows[2].string, rows[0].string, None, None)

        trade_detail_url = rows[6].a["onclick"]
        trade_detail_url = trade_detail_url[len("freshData('") + 2:len(trade_detail_url) - 2]

        # FIXME 查询个股交易席位详情需要传递 source_url 参数，
        # FIXME 简单粗暴删除掉在跨日期查询的时候会失败，需重新处理 source_url
        trade_detail_url = SZ_HOST + trade_detail_url.replace("&%SOURCEURL%", "")

        seats = query_stock_trade_detail_data(trade_detail_url, stock_trade_info)
        stock_trade_info.trade_seats = seats

        stock_trade_info_list.append(stock_trade_info)

        # print(stock_trade_info)

    return stock_trade_info_list


def _query_current_data():
    """查询当天上榜的数据"""
    current_date = time.strftime("%Y-%m-%d", time.localtime())
    current_date = "2016-08-15"

    stock_list = query_stock_list(current_date, current_date)

    print(len(stock_list))


if __name__ == '__main__':
    _query_current_data()
