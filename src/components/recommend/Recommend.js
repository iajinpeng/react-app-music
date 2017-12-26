/**
 * Created by jinpeng on 2017/12/26.
 */
import React from 'react'
import Swiper from 'swiper'
import Scroll from '@/common/scroll/Scroll'
import Loading from '@/common/loading/Loading'
import Lazyload, {forceCheck} from 'react-lazyload'
import {getCarousel, getNewAlbum} from '@/api/recommend'
import {CODE_SUCCESS} from '@/api/config'
import * as AlbumModel from '@/model/album'
import './recommend.styl'
import 'swiper/dist/css/swiper.css'

class Recommend extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loading: true,
			slideList: [],
			newAlbums: [],
			refreshScroll: false,
		}
	}
	componentDidMount(){
		getCarousel().then((res) =>{
			console.log('获取轮播图数据');
			if(res){
				console.log(res);
				if(res.code === CODE_SUCCESS){
					this.setState({
						slideList: res.data.slider
					}, () => {
						if(!this.sliderSwiper){
							//初始化轮播图
							this.sliderSwiper = new Swiper('.slider-container', {
								loop: true,
								autoplay: 5000,
								autoplayDisableOnInteraction: false,
								pagination: '.swiper-pagination',
							})
						}
					})
				}
			}
		})
		getNewAlbum().then((res) =>{
			console.log('获取最新专辑');
			if(res){
				console.log(res);
				if(res.code === CODE_SUCCESS){
					//根据发布时间降序
					let albumList = res.albumlib.data.list;
					albumList.sort((a, b) => {
						return new Date(b.public_time).getTime() - new Date(a.public_time).getTime();
					});
					this.setState({
						loading: false,
						newAlbums: albumList,
					}, () => {
						this.setState({refreshScroll: true});  //刷新scroll
					})
				}
			}
		})
	}
	toLink(linkUrl){
		return () =>{
			window.location.href = linkUrl;
		}
	}
	render(){
		let albums = this.state.newAlbums.map(item => {
			let album = AlbumModel.createAlbumByList(item);
			return (
				<div className="album-wrapper" key={album.mId}>
					<div className="left">
						<Lazyload height={60}>
							<img src={album.img} alt={album.name} width="100%" height="100%"/>
						</Lazyload>
					</div>
					<div className="right">
						<div className="album-name">
							{album.name}
						</div>
						<div className="singer-name">
							{album.singer}
						</div>
						<div className="public-time">
							{album.publicTime}
						</div>
					</div>
				</div>
			)
		});
		return (
			<Scroll refresh={this.state.refreshScroll} onScroll={(e) => {
				/*检查懒加载组件是否出现在视图中，如果出现就加载组件*/
				forceCheck();
			}}>
				<div className="music-recommend">
					<div className="slider-container">
						<div className="swiper-wrapper">
							{
								this.state.slideList.map(slider => {
									return (
										<div className="swiper-slide" key={slider.id}>
											<a className="slider-nav" onClick={this.toLink(slider.linkUrl)}>
												<img src={slider.picUrl} alt="推荐" width="100%" height="100%"/>
											</a>
										</div>
									)
								})
							}
						</div>
						<div className="swiper-pagination"></div>
					</div>
					<div className="album-container">
						<h1 className="title">最新专辑</h1>
						<div className="album-list">
							{albums}
						</div>
					</div>
				</div>
				<Loading title="正在加载..." show={this.state.loading} />
			</Scroll>
		)
	}
}

export default Recommend

