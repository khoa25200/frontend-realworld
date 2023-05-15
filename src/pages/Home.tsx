import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atom';
import Feed from '../components/feed/Feed';
import LinkTag from '../components/tag/LinkTag';
import Loading from '../components/common/Loading';

import { isLoggedInAtom } from '../atom';
import { getTags } from '../api/tags';
import { getUser } from '../api/user';

const Home = () => {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const navigate = useNavigate();

  const [toggle, setToggle] = useState(isLoggedIn ? 0 : 1);
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagListLoading, setTagListLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [tagName, setTagName] = useState('');
  const user = useRecoilValue(userAtom);
  const queryList = useMemo(
    () => [
      // eslint-disable-next-line react-hooks/rules-of-hooks
      `?author=${user.username}&`,
      '?',
      `?tag=${tagName}&`,
    ],
    [tagName]
  );

  const onClickTag = (tag: string) => {
    setToggle(2);
    setTagName(tag);
  };

  useEffect(() => {
    const initTags = async () => {
      setTagListLoading(true);
      try {
        const { tags } = await getTags();
        const tagListDF = ['tag1', 'tag2', 'welcome', 'introduction'];
        setTagList(tags || tagListDF);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useRecoilValue(userAtom);
        setUsername(user.username);
      } catch {}
      setTagListLoading(false);
    };

    initTags();
  }, []);

  useEffect(() => navigate('/', { replace: true }), [navigate]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Home — Dang Khoa</title>
        </Helmet>
      </HelmetProvider>

      <div className="home-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${toggle === 0 ? 'active' : ''}`}
                      to="/"
                      onClick={() => {
                        setToggle(0);
                      }}
                      hidden={!isLoggedIn}
                    >
                      Your Articles
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${toggle === 1 ? 'active' : ''}`}
                      to="/"
                      onClick={() => {
                        setToggle(1);
                      }}
                    >
                      Global Articles
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="/"
                      onClick={() => {
                        setToggle(2);
                      }}
                      hidden={toggle !== 2}
                    >
                      <i className="ion-pound"></i> {tagName}{' '}
                    </Link>
                  </li>
                </ul>
              </div>
              <Feed query={queryList[toggle]} url="/" limit={10} />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <div className="tag-list">
                  {tagListLoading ? (
                    <Loading height={10} />
                  ) : (
                    tagList.map(tag => (
                      <LinkTag
                        key={tag}
                        name={tag}
                        onClick={() => onClickTag(tag)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
