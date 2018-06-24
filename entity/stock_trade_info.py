class StockTradeInfo:

    def __init__(self, code, name, publish_date, disclose_reason, trade_seats):
        self.code = code
        self.name = name
        self.publish_date = publish_date
        self.disclose_reason = disclose_reason
        self.trade_seats = trade_seats

    def __repr__(self):
        return '<StockTradeInfo %r %r>' % (self.name, self.trade_seats)
