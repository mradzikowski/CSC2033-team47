import os
from datetime import datetime, timedelta

import tweepy


class TwitterHandler:
    def __init__(self):
        # Elevated Access Keys
        # Contact Joseph Krajewski at josephrhdk@gmail.com if these are not working
        self.consumer_key = os.getenv("CONSUMER_KEY") or " "
        self.consumer_secret = os.getenv("CONSUMER_SECRET") or " "
        self.access_token = os.getenv("ACCESS_TOKEN") or " "
        self.access_secret = os.getenv("ACCESS_SECRET") or " "
        # Authentications
        self.auth = tweepy.OAuthHandler(self.consumer_key, self.consumer_secret)
        self.auth.set_access_token(self.access_token, self.access_secret)
        self.api = tweepy.API(self.auth)

        # List of twitter accounts we want to get the most recent tweet from
        self.subscriptions = [
            "theCCCuk",
            "UNFCCC",
            "Momentum_UNFCCC",
            "FAOclimate",
            "ClimateReality",
            "NASAClimate",
            "ClimateGroup",
            "nytclimate",
            "ClimateGroup",
            "ClimateDesk",
            "citizensclimate",
            "USDAClimateHubs",
            "ClimateCentral",
            "CoveringClimate",
            "ClimateNCL",
        ]
        self.tweets_ids = []
        self.last_retrieved = None

    # Returns the user id of the given screen name
    def retrieve_id(self, name):
        # Retrieve the user by the screen name, get the id number
        user_id = self.api.get_user(screen_name=name).id_str
        return user_id

    # Get the most recent tweet of the given user
    def get_recent_tweet(self, name):
        recent_post = self.api.user_timeline(
            screen_name=name,
            count=1,
            include_rts=False,
            tweet_mode="extended",
        )[0]
        return recent_post

    # Gets the most recent tweets from all the subscriptions and outputs them in a list
    def get_all_new_tweets(self):
        if not self.last_retrieved:
            print(self.last_retrieved)
            self.last_retrieved = datetime.now()
            for account in self.subscriptions:
                tweet = self.get_recent_tweet(account)
                # print(tweet)
                print(tweet.id)
                self.tweets_ids.append(tweet.id)
        else:
            date_to_check = self.last_retrieved + timedelta(hours=12)
            print(self.last_retrieved)
            if self.last_retrieved < datetime.now() < date_to_check:
                return self.tweets_ids
            else:
                new_tweets_ids = []
                for account in self.subscriptions:
                    tweet = self.get_recent_tweet(account)
                    print(tweet.id)
                    new_tweets_ids.append(tweet.id)
                self.tweets_ids = new_tweets_ids

        return self.tweets_ids


TWITTER_HANDLER = TwitterHandler()
