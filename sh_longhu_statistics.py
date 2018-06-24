# coding: utf-8

import json
import time

from urllib.request import urlopen, Request
from bs4 import BeautifulSoup

from entity.stock_trade_seat import StockTradeSeat
from entity.stock_trade_info import StockTradeInfo


SH_HOST = "http://query.sse.com.cn"
SH_TRADE_LIST_URL = SH_HOST + "/infodisplay/showTradePublicFile.do?isPagination=false&dateTx="
REFERER = "http://www.sse.com.cn/disclosure/diclosure/public/"


def query_stock_list(trade_date):
    """查询某天上榜的股票"""
    url = SH_TRADE_LIST_URL + trade_date

    request = Request(url, headers={"Referer": REFERER})
    html = urlopen(request)
    file_contents = BeautifulSoup(html.read(), "html.parser").string
    file_contents = json.loads(file_contents)["fileContents"]

    print(file_contents)


def parse_stock_list():
    return None


if __name__ == '__main__':
    current_date = time.strftime("%Y-%m-%d", time.localtime())
    current_date = "2016-08-15"
    query_stock_list(current_date)
