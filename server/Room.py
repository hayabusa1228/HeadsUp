from State import GameState
class Player:
    name = ""
    money = 1000
    bet = 0
    rate = 0
    cards = []
    role = ""
    def __init__(self,money,bet):
        self.money = money
        self.bet = bet
        

class Room:
    table_id = "-1"
    state = GameState()
    player1 = Player(990,0)
    player2 = Player(980,10)
    common_cards = []
    pod = 30
    blind = [100,80,40,20,10]
    sb_first_action = True
    sb_bet = blind[(state.hand_num-1)//2]
    bb_bet = blind[(state.hand_num-1)//2]*2
    sb = player1.name
    bb = player2.name
    winner = -1
    game_winner = ""
    def __init__(self,p1_cards,p2_cards,common_cards,p1_best_role,p2_best_role,winner):
        self.player1.cards = p1_cards
        self.player2.cards = p2_cards
        self.player1.role = p1_best_role
        self.player2.role = p2_best_role
        self.common_cards = common_cards
        self.winner = winner
        
