# coding: utf-8

import sh_longhu_statistics as sh
import sz_longhu_statistics as sz


def statistics():
    trade_date = "2018-06-27"

    stock_list = []

    stock_list.extend(sz.get_stock_list(trade_date, trade_date))
    stock_list.extend(sh.get_stock_list(trade_date))

    seat_list = []

    for stock in stock_list:

        seats = stock.trade_seats

        for seat in seats:
            print("%r %r" % (seat.stock_trade_info.code, seat.name))


if __name__ == '__main__':
    statistics()
