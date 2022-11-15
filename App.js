import * as Location from "expo-location";
import React, { Component, useEffect, useState } from 'react'
import {RefreshControl, SafeAreaView, ScrollView,StyleSheet, View, ToastAndroid, Text} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import {markedDate} from "./Data/markedDates.js";

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일', '월','화','수','목','금','토'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const API_KEY = "ce688f249c2d7fddeda9c3093c17148f";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [dayw, setDayw] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`    );
    const json = await response.json();
    
    setDays(json.daily);
    var dayw = days.map((day)=>[day.weather[0].main, new Date(day.dt*1000).getDate(), new Date(day.dt*1000).getMonth()]);
    setDayw(dayw);
    console.log(dayw[0]);
    // console.log(city);
    
  };
  useEffect(() => {
    getWeather();
  }, []);

  
  var weatherRender = function(date){
    if(dayw[0]){
        for(var i in dayw){
        if(dayw[i][1] == date.day && dayw[i][2]+1==date.month){
          switch (dayw[i][0]){
            case "Clouds":
              return<><Text>☁️</Text></>;
            case "Clear":
              return<><Text>☀️</Text></>;
            case "Rain":
              return<><Text>🌧️</Text></>
            case "Snow":
              return<><Text>🌨️</Text></>;
            default :
              return<><Text>?</Text></>;
          };
        } else if(!dayw[0]){
          return<Text>empty</Text>
        }
      }
    }else{}
  }

  const markedDates = markedDate();


  var markerRender = function(date,num){
    var arr = [];
    for(var i in markedDates){
      for(var j in markedDates[i]){
        if(markedDates[i][j].day == date.day && markedDates[i][j].month==date.month&& markedDates[i][num]){
          return<View style={{width:50, height:5, backgroundColor: markedDates[i][num].color}}></View>
        } else{}
      }
    }
    //return <>a</>
  }

  const style = StyleSheet.create({
    empty:{
      width:45,
      height:10
    },
    marker:{
      width:50,
      height:5,
      backgroundColor: '#e93e42'
    }
  })


  return (
      <View style={{ paddingTop: 50, flex: 1 }}>
        <Text style={{textAlign: 'center'}}>{city}</Text>
        <Calendar

        dayComponent={({date, state}) => {
          
          return(
            <View>
              <Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>{date.day}</Text>
            {weatherRender(date)}
            {markerRender(date,0)}
            {markerRender(date,1)}
            {markerRender(date,2)}


            </View>
            
          );
        }}

        // Initially visible month. Default = Date()
        current={Date()}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate={undefined}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        maxDate={undefined}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {console.log('selected day', day)}}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {console.log('selected day', day)}}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {console.log('month changed', month)}}
        // Hide month navigation arrows. Default = false
        hideArrows={false}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        //renderArrow={(direction) => (<Arrow/>)}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={false}
        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange={false}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        // Hide day names. Default = false
        hideDayNames={false}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={substractMonth => substractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={addMonth => addMonth()}
        // Disable left arrow. Default = false
        disableArrowLeft={false}
        // Disable right arrow. Default = false
        disableArrowRight={false}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={true}
        /** Replace default month and year title with custom one. the function receive a date as parameter. */
        //renderHeader={(date) => {/*Return JSX*/}}
        
        
        />
      </View>
     )
}