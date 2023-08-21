class Card:
    suit = -1
    num = -1
    # 0:クラブ 1:ダイヤ 2:ハート 3:スペード
    def __init__( self,suit,num):
        self.suit = suit
        self.num = num
    def to_list(self):
        return [self.suit,self.num]
        



