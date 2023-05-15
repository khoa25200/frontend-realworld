import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue } from 'recoil';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Comment from '../components/article/Comment';
import ArticleTag from '../components/tag/ArticleTag';
import ArticleAction from '../components/article/ArticleAction';
import Loading from '../components/common/Loading';
import images from '../assets/img/index';
import { getArticle, deleteArticle, getArticles } from '../api/article';
import { deleteComment, getComments, postComment } from '../api/comment';
import { postFavorites, deleteFavorites } from '../api/favorites';
import { postFollow, deleteFollow } from '../api/profile';

import { isLoggedInAtom, userAtom } from '../atom';
import { ArticleProps, CommentProps } from '../types';
import { convertToDate } from '../utils';

const Article = () => {
  const [article, setArticle] = useState<ArticleProps>({
    slug: '',
    title: '',
    description: '',
    tagList: [],
    body: '',
    created: 0,
    updated: 0,
    favorited: false,
    favoriteCount: 0,
    author: {
      username: '',
      bio: '',
      image: '',
      following: false,
    },
  });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [isUser, setIsUser] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const user = useRecoilValue(userAtom);
  const { URLSlug } = useParams();
  const navigate = useNavigate();

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setComment(value);
  };

  const removeArticle = async () => {
    try {
      await deleteArticle(URLSlug!);
      navigate(-1);
    } catch {}
  };

  const publishComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const { article } = await postComment(URLSlug!, {
        body: comment,
      });
      setComments(article.comments);
      console.log('comments=>', article.comments);

      // setComment('');
    } catch {}
    setDisabled(false);
  };

  const removeComment = async (id: number) => {
    try {
      await deleteComment(URLSlug!, id);
      setComments(comments.filter(comment => comment.id !== id));
    } catch {}
  };

  const follow = async () => {
    try {
      await postFollow(article.author.username);
      setArticle({
        ...article,
        author: {
          ...article.author,
          following: true,
        },
      });
    } catch {}
  };

  const unfollow = async () => {
    try {
      await deleteFollow(article.author.username);
      setArticle({
        ...article,
        author: {
          ...article.author,
          following: false,
        },
      });
    } catch {}
  };

  const favorite = async () => {
    try {
      await postFavorites(article.slug);
      setArticle({
        ...article,
        favorited: true,
        favoriteCount: article.favoriteCount + 1,
      });
    } catch {}
  };

  const unfavorite = async () => {
    try {
      await deleteFavorites(article.slug);
      setArticle({
        ...article,
        favorited: false,
        favoriteCount: article.favoriteCount - 1,
      });
    } catch {}
  };
  // console.log('URLSlug=>', URLSlug);
  useEffect(() => {
    const initArticle = async () => {
      setLoading(true);
      try {
        let { article } = await getArticle(URLSlug!);
        console.log('article=>', article);
        // Temp
        if (!article.author) {
          const controller = new AbortController();
          const { signal } = controller;
          const { articles } = await getArticles('', signal);
          console.log('hi=<', {
            articles: articles,
            urlSlug: URLSlug!,
          });
          const author = articles.find((value: any) => {
            if (value.slug === URLSlug!) {
              return value;
            }
          });
          article = {
            ...author,
          };
        }
        setArticle(article);
        setPageTitle(article.title);
        setIsUser(article.author.username === user.username);
      } catch {
        navigate('/', { replace: true });
      }
      setLoading(false);
    };

    initArticle();
  }, [URLSlug, user.username, navigate]);

  useEffect(() => {
    const initComments = async () => {
      const { comments } = await getComments(URLSlug!);
      setComments(comments);
      console.log('comments->', comments[0]);
    };

    initComments();
  }, [URLSlug]);

  if (loading) return <Loading height={75} />;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
      </HelmetProvider>
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>

            <div className="article-meta">
              <Link to={`/profile/${article.author.username}`}>
                <img src={article.author.image || images.defaultAvatar} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">{convertToDate(article.created)}</span>
              </div>

              <ArticleAction
                isUser={isUser}
                removeArticle={removeArticle}
                follow={follow}
                unfollow={unfollow}
                favorite={favorite}
                unfavorite={unfavorite}
                article={article}
              />
            </div>
          </div>
        </div>
        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <ReactMarkdown
                children={article.body!}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          </div>
          <div>
            {article.tagList.map(tag => (
              <ArticleTag key={tag} name={tag} />
            ))}
          </div>
          <hr />
          <div className="article-actions">
            <div className="article-meta">
              <Link to={`/profile/${article.author.username}`}>
                <img src={article.author.image || images.defaultAvatar} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">{convertToDate(article.created)}</span>
              </div>

              <ArticleAction
                isUser={isUser}
                removeArticle={removeArticle}
                follow={follow}
                unfollow={unfollow}
                favorite={favorite}
                unfavorite={unfavorite}
                article={article}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              {isLoggedIn ? (
                <form className="card comment-form" onSubmit={publishComment}>
                  <div className="card-block">
                    <textarea
                      className="form-control"
                      placeholder="Write a comment..."
                      rows={3}
                      value={comment}
                      onChange={onChange}
                    ></textarea>
                  </div>
                  <div className="card-footer">
                    <img
                      src={user.image || images.defaultAvatar}
                      className="comment-author-img"
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={disabled}
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              ) : (
                <p>
                  <Link to="/login">Sign in</Link> or{' '}
                  <Link to="/register">Sign up</Link> to add comments on this
                  article.
                </p>
              )}
              <div>
                {comments.map((comment, index) => (
                  <Comment
                    key={index}
                    comment={comment}
                    removeComment={removeComment}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
