import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoutesUser from './components/auth/PrivateRoutesUser';
import PrivateRoutesAuth from './components/auth/PrivateRoutesAuth';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Engagements from './pages/Engagements';
import Tweet from './pages/Tweet';
import Reply from './pages/Reply';
import Profile from './pages/Profile';
import Followage from './pages/Followage';
import Suggested from './pages/Suggested';
import Bookmarks from './pages/Bookmarks';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoutesAuth />}>
                    <Route path="/" element={<Auth />} />
                </Route>
                <Route element={<PrivateRoutesUser />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/home/following" element={<Home />} />
                    <Route path="/tweet/:tweetId" element={<Tweet />} />
                    <Route path="/reply/:replyId" element={<Reply />} />
                    <Route path="/engagements/:elementId/retweets/:type" element={<Engagements />} />
                    <Route path="/engagements/:elementId/likes/:type" element={<Engagements />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/profile/:userId/with_replies" element={<Profile />} />
                    <Route path="/profile/:userId/media" element={<Profile />} />
                    <Route path="/profile/:userId/likes" element={<Profile />} />
                    <Route path="/:userId/following" element={<Followage />} />
                    <Route path="/:userId/followers" element={<Followage />} />
                    <Route path="/suggested" element={<Suggested />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                </Route>
            </Routes>
            <Toaster
                toastOptions={{
                    style: {
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        color: "black"
                    }
                }}
            />
        </Router>
    );
}

export default App;
