import fnmatch
import json
import os
import re
from collections import namedtuple
from difflib import get_close_matches

import dateutil.parser
from isodate import date_isoformat


class ParseReceipt(object):
    """ Market receipt to be parsed """

    def __init__(self, raw):
        """
        :param config: ObjectView
            Config object
        :param raw: [] of str
            Lines in file
        """
        filePath = os.path.join(os.getcwd(), 'app', 'data', 'common_retailers_only_names_top_50.json')
        with open(filePath) as data:
            self.marketOptions = dict(list(json.load(data).items()))
        self.market = None
        self.date = None
        self.firstLine = None #The first line in the receipt where a decimal was recognized
        self.sum = None
        self.subTotal = None
        self.liNumWithTot = None
        self.liNumsWithAmounts = {}
        self.byWord = None
        self.byLine = None
        self.expenses = []
        self.allTog = raw
        self.removeGarbage()
        self.parse()


    def parse(self):
        """
        :return: void
            Parses obj data
        """

        self.market = self.parse_market()
        self.date = self.parse_date()
        self.sum = self.parse_sum()
        self.expenses = self.parse_items()
        self.addMissing()

    def fuzzy_find(self, keyword, accuracy=0.6):
        """
        :param keyword: str
            The keyword string to look for
        :param accuracy: float
            Required accuracy for a match of a string with the keyword
        :return: str
            Returns the first line in lines that contains a keyword.
            It runs a fuzzy match if 0 < accuracy < 1.0
        """

        for line in self.byLine:
            words = line.split()
            # Get the single best match in line
            matches = get_close_matches(keyword, words, 1, accuracy)
            if matches:
                return line

    def parse_date(self):
        """
        :return: date
            Parses data
        """

        monDDYYYY = r'((\b\d{1,2}\D{0,3})?\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)\D?)(\d{1,2}(st|nd|rd|th)?)?((\s*[,.\-\/]\s*)\D?)?\s*((19[0-9]\d|20\d{2})|\d{2})*'
        monthName = r'^(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)$'
        YYYY = r'(19[0-9]\d|20\d{2})'
        MM = r'(0[1-9]|1[0-2])'
        DD = r'(0[1-9]|[12][0-9]|3[01])'
        sep = r'[\-.\/:,]'
        DDMMYYYY = DD + sep + MM + sep + YYYY
        YYYYMMDD = YYYY + sep + MM + DD
        MMDDYYYY = MM + sep + DD + sep + YYYY
        monDDYYYY = monthName + sep + DD + r', ' + YYYY
        DDMonYYYY = DD + sep + monthName + r', ' + YYYY
        YYYYMonDD = YYYY + r', ' + monthName + sep + DD
        master = '|'.join([monDDYYYY, MMDDYYYY, DDMMYYYY, YYYYMMDD, YYYYMonDD])
        dates = self.findall_overlapping(master, self.allTog) 
        
        #We'll just take the first match.
        matches = list(dates)
        date_str = matches[0].group() if len(matches) > 0 else ""
        return date_str

    

    def parse_market(self):
        """
        :return: str
            Parses market data
        """

        for int_accuracy in range(10, 6, -1):
            accuracy = int_accuracy / 10.0

            min_accuracy, market_match = -1, None
            for market in self.marketOptions.values():
                line = self.fuzzy_find(market, accuracy)
                if line and (accuracy < min_accuracy or min_accuracy == -1):
                    min_accuracy = accuracy
                    market_match = market
                    return market_match
 
            return self.byLine[0]

    def findall_overlapping(self, pattern, string, flags=0):
        """Find all matches, even ones that overlap."""
        regex = re.compile(pattern, flags)
        pos = 0
        while True:
            match = regex.search(string, pos)
            if not match:
                break
            yield match
            pos = match.start() + 1

    

    def parse_sum(self):
        """
        :return: str
            Parses sum data
        """
        for idx, line in enumerate(self.byLine):
            amounts = re.findall(r'\d+\.\d{2}\b', line)
            floats = [float(amount) for amount in amounts]
            unique = list(dict.fromkeys(floats))
            if len(unique) > 0:
                if self.firstLine is None:
                    self.firstLine = idx
                self.liNumsWithAmounts[idx] = max(unique)
                if "total" in line and not "sub" in line and max(unique) > 0:
                    self.liNumWithTot = idx
                    return max(unique)
        if len(self.liNumsWithAmounts) > 0:
            maxValLiNum = max(self.liNumsWithAmounts, key=self.liNumsWithAmounts.get)
            if maxValLiNum > min(list(self.liNumsWithAmounts.keys())) or len(self.liNumsWithAmounts) == 1:
                self.liNumWithTot = maxValLiNum
                return max(self.liNumsWithAmounts.values())
            else:
                self.liNumWithTot = max(self.liNumsWithAmounts.keys())
                return self.liNumsWithAmounts.get(self.liNumWithTot)
        return 0
    
    def parse_items(self):
        ignore = ['sub', 'subtotal', 'amount']
        items = []
        namePattern = r'[^a-zA-Z\s-]+'

        for idx, line in enumerate(self.byLine):
            if idx >= self.firstLine and idx < self.liNumWithTot and idx in self.liNumsWithAmounts.keys():
                if not self.liNumsWithAmounts.get(idx) >= 0.95 * self.sum:
                    skip = False
                    for item in ignore:
                        if item in line:
                            self.subTotal = self.liNumsWithAmounts.get(idx)
                            skip = True
                            break
                    if not skip:
                        name = re.sub(namePattern, "", line)
                        if name == '':
                            continue
                        items.append(
                            {
                                "expense_name": name,
                                "expense_price": self.liNumsWithAmounts.get(idx)
                            }
                        )

        return items



        #Remove garbage detected by OCR
    def removeGarbage(self):
        #Ignore words that have 4 or more consecutive letters or digits
        fourOrMoreRepeatedNumorLet = r'^.*([a-zA-Z0-9])\1{3,}.*$'
        #Ignore words that begin with 2 or more consecutive letters
        beginTwoOrMoreRepLet = r'^([a-zA-Z])\1{1,}.*$'
        newLines = []
        newContent = []
        #first, replace commas with dots
        self.allTog = self.allTog.replace(',','.')
        for row in self.allTog.splitlines():
            words = row.split(sep = ' ')
            keep = []
            #We're going to discard lines that contain 3 or more alpha-only words that are less than 3 in length
            numAlph3OrLess = 0
            for word in words:
                if len(word) > 0:
                    alpNum, vowel, cons, numNum, numLet, up, low, punc, disPunc = self.countFeat(word)
                    #if less than half of characters are alphanumeric, we ignore
                    if alpNum / len(word) <= 0.5:
                        continue
                    #If a string is nothing but alphabetic characters and the number of vowels is less than 10%
                    #of the number of consonants (or vice versa), we remove
                    if word.isalpha():
                        if cons > 0 and vowel > 0:
                            vc_ratio = vowel / cons
                            ratio = 0.1
                            if vc_ratio < ratio or vc_ratio > 10:
                                continue
                        else:
                            if vowel == 0 and cons > 7:
                                continue
                            else:
                                if cons == 0 and vowel > 4:
                                    continue
                    #If after stripping off the first and last character of string, there's two or more DISTINCT punctuation
                    #characters inside, we assume it's garbage.
                    if len(word) >= 4:
                        new = word[1:-1]
                        counts = self.countFeat(new)
                        if counts[8] >= 2:
                            continue
                    #If the word contains uppercase within lowercase, then it is garbage:
                    if len(word) >= 3 and word[0].islower() and word[-1].islower() and up > 0:
                        continue
                    #If a string has more uppercase than lowercase letters and if the number of uppercase letters is 
                    #less than the total number of characters, it is garbage
                    allUpper = up == len(word)
                    if (up > low) and not allUpper:
                        continue
                    if word.isalpha() and len(word) <= 3:
                        numAlph3OrLess += 1
                    #Text detected by OCR will be garbage if length of word is less
                    #than 3 letters
                    if numNum == 0 and numLet < 3:
                        continue
                    #Text detected by OCR will be garbage if length of word is greater
                    #than 20
                    if len(word) > 20:
                        continue
                    #If there 4 consective same letters or digits in a word it will garbage
                    if re.match(fourOrMoreRepeatedNumorLet, word):
                        continue
                    #If the word begins with two or more consecutive letters, it will be garbage
                    if re.match(beginTwoOrMoreRepLet, word):
                        continue
                    #Alpha numeric string having length greater than 5 digits will be considered as garbage. 
                    if word.isalnum() and numNum > 5:
                        continue
                    #If letters to numbers ratio in string /word is greater than 50%, word will treated as a garbage. 
                    if numLet > 0 and numNum > 0:
                        if numLet / numNum > 0.5:
                            continue
                    #print("555555555")

                    keep.append(word.lower())

            if len(keep) > 0 and keep[0] != '' and numAlph3OrLess < 3:
                newLines.append(keep)
                newContent.append(' '.join(keep))
        
        self.byWord = newLines
        self.byLine = newContent
        self.allTog = '\n'.join(newContent)
        #print(self.allTog)
    
    def countFeat(self, word: str):
        counPunc = 0
        couPuncDist = 0
        punc = set()
        counAlpNum = 0
        counVowel = 0
        counCons = 0
        counNum = 0
        counLet = 0
        counUp = 0
        counLow = 0
        for char in word:
            if char.isalnum():
                counAlpNum += 1
                if char.isalpha():
                    counLet += 1
                    if char.isupper():
                        counUp += 1
                    else:
                        counLow += 1
                    if char in "aeiouAEIOU":
                        counVowel += 1
                    else:
                        counCons += 1 
                else:
                    counNum += 1
            elif char in ('!', "," ,"\'" ,";" ,"\"", ".", "-" ,"?"):
                punc.add(char)
                counPunc += 1
        #print("aaaaaa")
        couPuncDist = len(punc)
        return counAlpNum, counVowel, counCons, counNum, counLet, counUp, counLow, counPunc, couPuncDist
    
    def addMissing(self):
        tot = 0
        for expense in self.expenses:
            tot += expense['expense_price']
        
        if tot < self.sum:
            miss = self.sum - tot
            self.expenses.append({
                "expense_name": "Other",
                "expense_price": miss
            })

    def to_dict(self):
        """
        :return: dict
            Convert Receipt object to dict
        """
        object_data = {
            "receipt": {
                "receipt_date": self.date, 
                "receipt_name": self.market
            },
            "expenses": self.expenses,
            "Total": self.sum,
            "SubTotal": self.subTotal,
            "lines": self.byLine
        }

        return object_data