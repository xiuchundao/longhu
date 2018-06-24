# coding: utf-8

import sh_longhu_statistics as sh
import sz_longhu_statistics as sz


def statistics():
    sh.query_stock_list("2016-08-15")
    sz.query_stock_list("2016-08-15", "2016-08-15")


if __name__ == '__main__':
    statistics()
