import math
from datetime import datetime
from backports.datetime_fromisoformat import MonkeyPatch


def calculate_score(n_comments, n_likes, n_views, posted_date):
    n_days_ago = (datetime.utcnow() - posted_date).days
    score = 3 * n_comments + 2 * n_likes + n_views + (0.9 ** n_days_ago)
    return score


def get_post_score(post_info):
    n_comments = len(post_info['comments'])
    n_likes = len(post_info['liked_by'])
    n_views = int(post_info['view_count']) if ('view_count' in post_info) else 0

    MonkeyPatch.patch_fromisoformat()
    posted_date = datetime.fromisoformat(post_info['timestamp'])

    return calculate_score(n_comments, n_likes, n_views, posted_date)


