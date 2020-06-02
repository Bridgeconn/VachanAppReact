import React, { Component } from 'react';
import {
	StyleSheet,
	PixelRatio,
	Text,
	View,
	TouchableOpacity,
	Platform,
	Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

var {
	width,
	height
} = Dimensions.get('window');
import {connect} from 'react-redux'
import {getBookNameFromMapping} from '../utils/UtilFunctions';


class FlowView extends Component {
	
	render() {
		return (
			<View>
				<TouchableOpacity onPress={()=>{
					this.props.onTextClick();
				}}>
					<View style={[styles.corner,{backgroundColor:'transparent'}]}>
						<Text style={this.props.styles.textStyle}>{getBookNameFromMapping(this.props.bookId,this.props.language)} {this.props.chapterNumber}:{this.props.verseNumber}</Text>
                        <Icon name="clear" style={this.props.styles.iconReferClose}
                        	onPress={()=> {this.props.onDeleteClick()}} />
					</View>
                </TouchableOpacity>
            
			</View>
		);
	};

}
class FlowLayout extends Component {
	
	constructor(props) {
		super(props);
    }

	render() {
		// console.log('FLOW LAYOUT BCV REF ',this.props.bcvRef)
		let items = this.props.dataValue.verses.map((value, position) => {
			return (
				<View key={position}>
				{/* <TouchableOpacity onPress={()=>{
					this.props.openReference(position)
				}}> */}
					<View style={[styles.corner,{backgroundColor:'transparent'}]}>
						<Text style={this.props.styles.textStyle}>{getBookNameFromMapping(this.props.dataValue.bookId,this.props.language)} {this.props.dataValue.chapterNumber}:{value}</Text>
                        {/* <Icon name="clear" style={this.props.styles.iconReferClose}
                        	onPress={()=> {this.props.deleteReference(position)}} /> */}
					</View>
                {/* </TouchableOpacity> */}

					{/* <FlowView 
					//  ref ={this.props.dataValue[position]} 
					text={this.props.dataValue} 
                        onDeleteClick={()=>{
                            this.props.deleteReference(position);
                        }}
                        onTextClick={()=>{
                            this.props.openReference(position);
						}}
						styles={this.props.styles}
                    /> */}
				</View>
			);
		});

		return (
			<View style={[styles.container,this.props.style]}>
				{items}
			</View>
		);
	};
}
const mapStateToProps = state =>{
	return{
	  language:state.updateVersion.language,
	  sizeFile:state.updateStyling.sizeFile,
	  colorFile:state.updateStyling.colorFile,
	  
	}
  }
  
  
  
  export  default connect(mapStateToProps,null)(FlowLayout)
const styles = StyleSheet.create({
	corner: {
        flexDirection:'row',
		borderColor: 'gray',
		borderWidth: 1, /// PixelRatio.get(),
		borderRadius: 20,
		justifyContent: 'center',
        alignItems: 'center',
		paddingHorizontal: 10,
        paddingVertical: 4,
        padding:10,
		marginRight: 10,
        marginTop: 10,
	},
	text: {
		fontSize: 16,
		textAlign: 'center',
	},
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		width: width,
	},

});