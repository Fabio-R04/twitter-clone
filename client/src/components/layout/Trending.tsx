import React from "react";
import ThreeDotsIcon from "./svg/ThreeDotsIcon";

function Trending() {
    return (
        <div className="layout__info-trending">
            <p className="layout__info-trending__title">What's happening</p>
            <div className="layout__info-trending__item">
                <div className="layout__info-trending__item-top">
                    <div>
                        <p>Politics &middot; Trending</p>
                        <p className="layout__info-trending__item-middle">Kevin McCarthy</p>
                    </div>
                    <div title="More">
                        <ThreeDotsIcon />
                    </div>
                </div>
            </div>
            <div className="layout__info-trending__item">
                <div className="layout__info-trending__item-top">
                    <div>
                        <p>Movies & TV &middot; Trending</p>
                        <p className="layout__info-trending__item-middle">Norman Lear</p>
                    </div>
                    <div title="More">
                        <ThreeDotsIcon />
                    </div>
                </div>
            </div>
            <div className="layout__info-trending__item">
                <div className="layout__info-trending__item-top">
                    <div>
                        <p>Gaming &middot; Trending</p>
                        <p className="layout__info-trending__item-middle">Bungie</p>
                        <p className="layout__info-trending__item-bottom">8,237 posts</p>
                    </div>
                    <div title="More">
                        <ThreeDotsIcon />
                    </div>
                </div>
            </div>
            <div className="layout__info-trending__item">
                <div className="layout__info-trending__item-top">
                    <div>
                        <p>Pop &middot; Trending</p>
                        <p className="layout__info-trending__item-middle">Person of the Year</p>
                    </div>
                    <div title="More">
                        <ThreeDotsIcon />
                    </div>
                </div>
            </div>
            <div className="layout__info-trending__item">
                <div className="layout__info-trending__item-top">
                    <div>
                        <p>Technology &middot; Trending</p>
                        <p className="layout__info-trending__item-middle">Gemini</p>
                    </div>
                    <div title="More">
                        <ThreeDotsIcon />
                    </div>
                </div>
            </div>
            <div className="layout__info-trending__more">
                <p>Show more</p>
            </div>
        </div>
    )
}

export default Trending;