/**
 * Created by jinpeng on 2017/12/26.
 */
import React from 'react'
import './ranking.styl'

class Ranking extends React.Component {

	shabi(){
		console.log(this)
	}
	render(){
		return (
			<div className="music-ranking">
				<div ref="shabi">黄鹤老板</div>
				<button onClick={this.shabi.bind(this, undefined)}>你是傻逼吗</button>
			</div>
		)
	}
}

export default Ranking