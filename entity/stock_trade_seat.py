class StockTradeSeat:

    def __init__(self, status, name, buy_amount, sell_amount, stock_trade_info):
        self.status = status
        self.name = name
        self.buy_amount = buy_amount
        self.sell_amount = sell_amount
        self.stock_trade_info = stock_trade_info

    def __repr__(self):
        return '<StockTradeSeat %r %r %r %r>' % (self.stock_trade_info.code, self.stock_trade_info.name, self.status, self.name)

