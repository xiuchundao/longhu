# coding: utf-8

import json
import time
import os

from urllib.request import urlopen, Request
from bs4 import BeautifulSoup

from entity.stock_trade_seat import StockTradeSeat
from entity.stock_trade_info import StockTradeInfo

SH_HOST = "http://query.sse.com.cn"
SH_TRADE_LIST_URL = SH_HOST + "/infodisplay/showTradePublicFile.do?isPagination=false&dateTx="
REFERER = "http://www.sse.com.cn/disclosure/diclosure/public/"

base_dir = os.path.abspath(os.path.dirname(__file__))


def get_stock_list(trade_date):
    return parse_stock_list(query_stock_list(trade_date))


def query_stock_list(trade_date):
    """查询某天上榜的股票，返回未经处理的源数据，格式见上海交易所"""

    url = SH_TRADE_LIST_URL + trade_date

    request = Request(url, headers={"Referer": REFERER})
    html = urlopen(request)
    file_contents = BeautifulSoup(html.read(), "html.parser").string
    file_contents = json.loads(file_contents)["fileContents"]

    # print(file_contents)

    return file_contents


def parse_stock_list(stock_list_source_data):
    """解析上榜股票列表的源数据"""

    if not stock_list_source_data:
        return None

    stock_list = []
    trade_date = stock_list_source_data[2][5:]

    # 根据上榜类型将源数据分割
    source_data_list = split_source_data(stock_list_source_data)

    # 从资源文件读取上榜类型数据
    disclose_type_list = []
    with open(base_dir + "/resource/sh_disclose_type.txt") as f:
        for line in f.readlines():
            line = line.replace("\n", "")
            disclose_type_list.append(line)

    # 迭代上榜类型列表
    for index, data in enumerate(source_data_list):
        if index not in (10, 11, 12, 13, 16):
            # 除去条件中的几种，其它均包含 A 股、B 股、基金数据，做进一步处理，只提取 A 股数据
            a_share_data = extract_a_share_data(data)
        elif index in (10, 12, 13):
            a_share_data = data[2:] if len(data) > 2 else None
        else:
            # 11、16 上榜类型的数据不需要，因此不做处理
            a_share_data = None

        if a_share_data:
            # 删除空元素
            while "" in a_share_data:
                a_share_data.remove("")

            index_list = []

            # 找到分隔符的位置
            for i, d in enumerate(a_share_data):
                if d == "      --------------------------------------------" \
                        "----------------------------------------------------------":
                    index_list.append(i)
            index_list_len = len(index_list)

            # 根据分隔符的位置找出每个股票的交易席位数据
            for i in range(index_list_len):
                if i < index_list_len - 2:
                    seat_list = a_share_data[index_list[i] + 1:index_list[i + 1]]
                else:
                    seat_list = a_share_data[index_list[i] + 1:]

                stock_info = a_share_data[index_list[i] - 1]
                stock_info = stock_info.replace(" ", "")
                name = stock_info[16:]
                code = stock_info[5:11]
                stock = StockTradeInfo(code, name, trade_date, None, None)
                stock.trade_seats = parse_seat_list(seat_list, stock)

                stock_list.append(stock)

    return stock_list


def split_source_data(source_data):
    """根据上榜类型将源数据切割开"""

    # 从文件解析披露类型，同时将各披露类型在源数据中的索引存储下来
    disclose_type_list = []
    disclose_type_index_list = []

    with open(base_dir + "/resource/sh_disclose_type.txt") as f:
        for line in f.readlines():
            line = line.replace("\n", "")
            disclose_type_list.append(line)
            disclose_type_index_list.append(source_data.index(line))

    disclose_type_list_len = len(disclose_type_list)

    # 通过披露类型的索引将源数据切割，切割之后放置到列表中
    source_stock_list = []
    for index in range(disclose_type_list_len):
        if index < disclose_type_list_len - 2:
            source_stock_list \
                .append(source_data[disclose_type_index_list[index]:disclose_type_index_list[index + 1]])
        else:
            source_stock_list.append(source_data[disclose_type_index_list[index]:])

    return source_stock_list


def extract_a_share_data(a_share_data):
    """从一个分类数据中提取出 A 股的交易数据"""

    index = -1
    try:
        index = a_share_data.index("", 0, 2)
    except ValueError as Argument:
        pass

    # 根据上海数据的固定格式来看，如果找到 "" 表示没有 A 股相关的龙虎数据
    if index != -1:
        # print("未找到数据")
        return None

    return a_share_data[a_share_data.index("") + 1:a_share_data.index(" 2、B股") - 1]


def parse_seat_list(seat_list_data, stock_trade_info):
    """解析席位数据，返回解析后的席位列表"""

    new_seat_list_data = []

    # 查找 '卖出营业部' 开始的位置，用以分割买卖席位
    index = 0
    for i, seat in enumerate(seat_list_data):
        try:
            if seat.index("卖出"):
                index = i
                break
        except ValueError:
            pass

    buy_seat_list_data = seat_list_data[1:index]
    sell_seat_list_data = seat_list_data[index + 1:]

    for seat_data in buy_seat_list_data:
        index = buy_seat_list_data.index(seat_data)

        name = seat_data[6:seat_data.rindex(" ")].replace(" ", "")
        sell_amount = 0
        status = "买" + str(index + 1)
        buy_amount = seat_data[seat_data.rindex(" ") + 1: len(seat_data)]
        new_seat_list_data.append(StockTradeSeat(status, name, buy_amount, sell_amount, stock_trade_info))

    for seat_data in sell_seat_list_data:
        index = sell_seat_list_data.index(seat_data)

        name = seat_data[6:seat_data.rindex(" ")].replace(" ", "")
        buy_amount = 0
        status = "卖" + str(index + 1)
        sell_amount = seat_data[seat_data.rindex(" ") + 1: len(seat_data)]
        new_seat_list_data.append(StockTradeSeat(status, name, buy_amount, sell_amount, stock_trade_info))

    return new_seat_list_data


if __name__ == '__main__':
    current_date = time.strftime("%Y-%m-%d", time.localtime())
    current_date = "2018-06-27"
    source_data = query_stock_list(current_date)
    stocks = parse_stock_list(source_data)

    print(stocks)
