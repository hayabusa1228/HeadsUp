import Card
class Player:
    name = ""
    cards = []
    role = ""

class State:
    table_id = -1
    player1 = Player()
    player2 = Player()
    common_cards = []
    pot = 0
    winner = -1
    def __init__(self,p1_cards,p2_cards,common_cards,p1_best_role,p2_best_role,winner):
        self.player1.cards = p1_cards
        self.player2.cards = p2_cards
        self.player1.role = p1_best_role
        self.player2.role = p2_best_role
        self.common_cards = common_cards
        self.winner = winner
        
