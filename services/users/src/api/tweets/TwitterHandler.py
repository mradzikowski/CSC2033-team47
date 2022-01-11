import tweepy


class TwitterHandler:

    def __init__(self):
        # Elevated Access Keys
        # Contact Joseph Krajewski at josephrhdk@gmail.com if these are not working
        self.consumer_key = '7cS0tvzAEKuNNFGylpNB4G12p'
        self.consumer_secret = 'NT37VeZfFqxmce5f3tjT4sO5qCr7g7Whxc213SrQh5O3hWTR49'
        self.access_token = '1468262996694679571-R1HwMsujLNHkLKz6XJz1dwfQlBfGGb'
        self.access_secret = 'CDAKLwfkp9L6VuxqgC8RkhpaASVSu6LKGOGXEUGU6mxSZ'
        # Authentications
        self.auth = tweepy.OAuthHandler(self.consumer_key, self.consumer_secret)
        self.auth.set_access_token(self.access_token, self.access_secret)
        self.api = tweepy.API(self.auth)

        # List of twitter accounts we want to get the most recent tweet from
        self.subscriptions = ["theCCCuk", "UNFCCC", "Momentum_UNFCCC", "FAOclimate", "ClimateReality", "NASAClimate",
                              "ClimateGroup","nytclimate", "ClimateGroup", "ClimateDesk", "citizensclimate",
                              "USDAClimateHubs", "ClimateCentral", "CoveringClimate", "ClimateNCL"]

    # Returns the user id of the given screen name
    def retrieve_id(self, name):
        # Retrieve the user by the screen name, get the id number
        user_id = self.api.get_user(screen_name=name).id_str
        return user_id

    # Get the most recent tweet of the given user
    def get_recent_tweet(self, name):
        recent_post = self.api.user_timeline(screen_name=name, count=1, include_rts=False, tweet_mode="extended")[0]
        return recent_post

    # Gets the most recents tweets from all the subscriptions and outputs them in a list
    def get_all_new_tweets(self):

        tweet_ids = []

        for account in self.subscriptions:
            tweet = self.get_recent_tweet(account)
            print(tweet.id)
            tweet_ids.append(tweet.id)



twitter_handler = TwitterHandler()

twitter_handler.get_all_new_tweets()





