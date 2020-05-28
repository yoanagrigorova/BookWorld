import React from 'react';
import "./Home.css"
import M from 'materialize-css';

export default class Home extends React.Component {

    componentDidMount() {
        M.Carousel.init(this.carousel);
    }

    render() {
        return (
            <div className="home">
                <div className="carousel" ref={(carousel) => { this.carousel = carousel }}>
                    <a className="carousel-item" href="#one!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#two!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#three!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#four!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>
                    <a className="carousel-item" href="#five!"><img alt="" src="https://media.wired.com/photos/5be4cd03db23f3775e466767/125:94/w_2375,h_1786,c_limit/books-521812297.jpg" /></a>

                </div>

                <div className="col s6 m6 l6 offset-s2">
                    <h2 className="header">Horizontal Card</h2>
                    <div className="card small horizontal">
                        <div className="card-image">
                            <img  alt="" src="https://prodimage.images-bn.com/pimages/9780316438988_p0_v2_s550x406.jpg" />
                        </div>
                        <div className="card-stacked">
                            <div className="card-content">
                                <p>I am a very simple card. I am good at containing small bits of information.</p>
                            </div>
                            <div className="card-action">
                                <a href="#">This is a link</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}