import random
from Card import Card
from State import State

class Game_Engine:
    # 0:クラブ 1:ダイヤ 2:ハート 3:スペード
    cards = [Card(i,j) for i in range(4) for j in range(1,14)]
    def get_cards_and_result(self):
        random.shuffle(self.cards)
        player1_cards = [self.cards[0],self.cards[1]]
        player2_cards = [self.cards[2],self.cards[3]]
        common_cards = [self.cards[4],self.cards[5],self.cards[6],self.cards[7],self.cards[8]]
        result = self.judge_result(player1_cards,player2_cards,common_cards)
        p1_best_role = result[0]
        p2_best_role = result[1]
        winner = result[2]
        return State(player1_cards,player2_cards,common_cards,self.check_role(p1_best_role),self.check_role(p2_best_role),winner)
                            
    # 0:ハイカード 1:ワンペア 2:
    def judge_result(self,p1_cards,p2_cards,common_cards):
        # p1の得点
        p1_all_cards = p1_cards + common_cards
        p1_best_role = self.get_best_role(p1_all_cards)
        p2_all_cards = p2_cards + common_cards
        p2_best_role = self.get_best_role(p2_all_cards)
        result = self.compare_role(p1_best_role,p2_best_role)
        return [p1_best_role,p2_best_role,result]


    def get_best_role(self,all_cards):
        best_role = all_cards[:5]
        for a in range(0,3):
            for b in range(a+1,4):
                for c in range(b+1,5):
                    for d in range(c+1,6):
                        for e in range(d+1,7):
                            cards = [
                                all_cards[a],
                                all_cards[b],
                                all_cards[c],
                                all_cards[d],
                                all_cards[e],
                            ]
                            result = self.compare_role(best_role,cards)
                            if result == 2:
                                best_role = cards
        return best_role
     
                                
    def check_role(self,cards):
        i = self.check_straight_flush(cards)
        if(i != -1): return "straight_flush:" + str(i)
        i = self.check_4cards(cards)
        if(i != -1): return "4cards:"+ str(i)
        i = self.check_fullhouse(cards)
        if(i != -1): return "full_house:" + str(i)
        i = self.check_flush(cards)
        if(i != -1): return "flush:" + str(i)
        i = self.check_straight(cards)
        if(i != -1): return "straight:" + str(i)
        i = self.check_3cards(cards)
        if(i != -1): return "3cards:" + str(i)
        i = self.check_2pair(cards)
        if(i != -1): return "2pair:" + str(i)
        i = self.check_1pair(cards)
        if(i != -1): return "1pair:" + str(i)
        i = self.check_highCard(cards)
        if(i != -1): return "high_card:" + str(i)


    def compare_role(self,cards1,cards2):
        # ストレートフラッシュ(-1はあてはまらないことを意味)
        i = self.check_straight_flush(cards1)
        j = self.check_straight_flush(cards2)
        result = self.compare(i,j)
        if(result != -1): return result
        #4card
        i = self.check_4cards(cards1)
        j = self.check_4cards(cards2)
        result = self.compare(i,j)
        if(result != -1): return result
        # フルハウス
        i = self.check_fullhouse(cards1)
        j = self.check_fullhouse(cards2)
        result = self.compare(i,j)
        if(result != -1): return result
        # フラッシュ
        i = self.check_flush(cards1)
        j = self.check_flush(cards2)
        result = self.compare(i,j)
        if(result != -1): return result
        # ストレート
        i = self.check_straight(cards1)
        j = self.check_straight(cards2)
        result = self.compare(i,j)
        if(result != -1): return result
        # 3cards
        i = self.check_3cards(cards1)
        j = self.check_3cards(cards2)
        result = self.compare(i,j)
        if(result != -1): return result
        # 2pair
        i = self.check_2pair(cards1)
        j = self.check_2pair(cards2)
        result = self.compare(i,j)
        if(result > 0): return result
        if result == 0:
            new_card1 = []
            for card in cards1:
                if card.num != i:
                    new_card1.append(card)
            cards1 = new_card1
            new_card2 = []
            for card in cards2:
                if card.num != i:
                    new_card2.append(card)
            cards2 = new_card2
        #1pair
        i = self.check_1pair(cards1)
        j = self.check_1pair(cards2)
        result = self.compare(i,j)
        if(result > 0): return result
        if result == 0:
            new_card1 = []
            for card in cards1:
                if card.num != i:
                    new_card1.append(card)
            cards1 = new_card1
            new_card2 = []
            for card in cards2:
                if card.num != i:
                    new_card2.append(card)
            cards2 = new_card2
        # highCard
        i = self.check_highCard(cards1)
        j = self.check_highCard(cards2)
        result = self.compare(i,j)
        return result
        
    def compare(self,i,j):
        if(i > j):
            return 1
        elif(j > i):
            return 2
        else:
            if i != -1 and j != -1:
                return 0
        return -1
    
    def check_straight_flush(self,cards):
        i = self.check_flush(cards)
        j = self.check_straight(cards)
        if i != -1 and j != -1:
            return i
        else:
            return -1

    def check_straight(self,cards):
        nums = [0 for i in range(14)]
        for card in cards:
            if(card.num == 1): nums[13]+= 1
            nums[card.num-1]+=1
        count = 0
        for i in range(len(nums)):
            if count == 5:
                return i
            if nums[i] == 0:
                count = 0
            else:
                count += 1
        return -1
                

    def check_flush(self,cards):
        suits = [0,0,0,0]
        max_num = -1
        for card in cards:
            if card.num == 1:
               max_num = 14
            if card.num > max_num:
                max_num = card.num
            suits[card.suit] += 1
        for i in suits:
            if i == 5:
                return max_num
        return -1
    
    def check_fullhouse(self,cards):
        i = self.check_3cards(cards)
        j = self.check_1pair(cards)
        if i != -1 and j != -1:
            return i
        return -1
    
    def check_4cards(self,cards):
        nums = [0 for i in range(13)]
        for card in cards:
            nums[card.num-1] += 1
        for i in range(len(nums)):
            if nums[i] == 4:
                return i+1
        return -1
    
    def check_3cards(self,cards):
        nums = [0 for i in range(13)]
        for card in cards:
            nums[card.num-1] += 1
        for i in range(len(nums)):
            if nums[i] == 3:
                return i+1
        return -1
    
    def check_1pair(self,cards):
        nums = [0 for i in range(13)]
        for card in cards:
            nums[card.num-1] += 1
        pair_num = 0
        max_num = -1
        for i in range(len(nums)):
            if nums[i] == 2:
                pair_num+=1
                if i==0:
                    max_num = 14
                else:
                    max_num = i+1
        if(pair_num==1): return max_num
        return -1
    
    def check_2pair(self,cards):
        nums = [0 for i in range(13)]
        for card in cards:
            nums[card.num-1] += 1
        pair_num = 0
        max_num = -1
        for i in range(len(nums)):
            if nums[i] == 2:
                pair_num+=1
                if i==0:
                    max_num = 14
                if i+1 > max_num:
                    max_num = i+1
        if(pair_num==2): return max_num
        return -1
    
    def check_highCard(self,cards):
        max_num = -1
        for card in cards:
            if card.num == 1:
                max_num = 14
            if card.num > max_num:
                 max_num = card.num
        return max_num
              
if __name__ == "__main__":
    game_engine =  Game_Engine()
    state = game_engine.get_cards_and_result()
    print("p1")
    for card in state.player1.cards:
        print("suit:" + str(card.suit) + " num:" + str(card.num))
    print("p2")
    for card in state.player2.cards:
        print("suit:" + str(card.suit) + " num:" + str(card.num))
    print("common")
    for card in state.common_cards:
        print("suit:" + str(card.suit) + " num:" + str(card.num))
    print("p1=" + state.player1.role)
    print("p2=" + state.player2.role)
    print(state.winner)

        
        

        
    








        
        