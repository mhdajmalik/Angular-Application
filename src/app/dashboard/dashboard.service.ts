import { Injectable } from '@angular/core';

import { HttpService } from '../shared/services/http.service';
import { appConstants } from '../shared/constants/app.constant'

@Injectable()
export class DashboardService {

  AGENT_MANAGER = "AgentManager";
  DashboardAgent = 'Equipment.Dashboard';
      HOST_NAME: any;

  constructor(private httpService: HttpService) { }


  getViewContent(cbSuccess, cbError) {
    debugger;
    var body = {
      AgentLocator: this.DashboardAgent,
      RequestParam: {
        DataLevelName:"Project",
        SelectedFilterList:[],
        SelectedFilterIdsList:["5a58b7a917b4990f202f81fa"]
      }
    }
    this.httpService.callServerAPI(this.AGENT_MANAGER, "GetViewContent", body)
      .subscribe(
      (result: any) => {
        if (!result) {
          console.log('getHistoryData: Response ' + result);
        } else {
          let parsedViewContents = this.getParsedViewContents(result);
          cbSuccess(parsedViewContents);
        }

      },
      error => cbError(error)
      );
  }

  getParsedViewContents(viewContents, filterIdsList?) {
    console.log('parsedViewContents called');
    let retViewContents: any = {};
    let widgets: any = [];
    if (viewContents) {
      retViewContents.dataLevel = {
        id: viewContents.DataLevel.Id,
        connectedObject: viewContents.DataLevel.ConnectedObject,
        isPresent: viewContents.DataLevel.IsPresent,
        layoutName: viewContents.DataLevel.LayoutName,
        name: viewContents.DataLevel.Name,
        nextLevel: viewContents.DataLevel.NextLevel,
        parentLevel: viewContents.DataLevel.ParentLevel,
        viewManagerTitle: viewContents.DataLevel.ViewManagerTitle,
        description: viewContents.DataLevel.Description

      }
      retViewContents.multiSelectFilter = viewContents.FilterIsMultiSelect;
      retViewContents.filterList = this.getParsedFilterList(viewContents.FilterIsMultiSelect, viewContents.FilterList, filterIdsList);
      retViewContents.propertyList = this.getParsedPropertyList(viewContents.CustomFilters);

      let changedwidgets = null;
      if (viewContents.Layout) {
        changedwidgets = this.get8XWidgetsOnly(viewContents.Layout.WidgetList,
          viewContents.Layout.ViewList['8 X'].WidgetPositions, viewContents.Layout.SubTypeName);
        retViewContents.referenceLinks = this.getParsedReferenceLinks(viewContents.ReferanceLinks);
      } else {
        viewContents.Layout = this.setNullLayout();
        retViewContents.referenceLinks = [];
      }

      widgets = this.handleResponseData(changedwidgets);
      //{                Widgets: changedwidgets     }
      retViewContents.layout = {
        name: viewContents.Layout.Name,
        dashBoardSettings: viewContents.Layout.DashBoardSettings,
        miniWidgetSettings: viewContents.Layout.ViewList['8 X'].MiniWidgetSettings,
        widgetPositions: viewContents.Layout.ViewList['8 X'].WidgetPositions,
        widgetsList: widgets.MiniWidgets.concat(widgets.Widgets),
        Type: viewContents.Layout.Type,
        SubTypeName: viewContents.Layout.SubTypeName
        //                AllowMultipleDataSource: viewContents.Layout.AllowMultipleDataSource

      };
    }

    if (!retViewContents.filterList || !retViewContents.filterList.length) {
      console.log('filter List is empty')
    }
    return retViewContents;
  }


   getParsedFilterList(isMultiSelect, filters, filterIdsList) {
        let parsedFilters = [];
        let isSetRadio = false;

        if (filters.length != 0 && isMultiSelect) {
            parsedFilters.push({
                id: 'all',
                name: 'All',
                idName: 'all',
                isSelected: true,
                displayName: 'All',
                dataLevelName: 'None'
            });
        }
        for (let index = 0; index < filters.length; index++) {
            parsedFilters.push({
                dataLevelName: filters[index].DataLevelName,
                description: filters[index].Description,
                id: filters[index].Id,
                isSelected: isMultiSelect ? true : filters[index].IsSeleted,
                name: filters[index].Name,
                displayName:'',
                // this.getFilterDisplayName(filters[index]),
                idName: filters[index].Name.replace(/[^a-zA-Z0-9]/g, ''),
                objectRefId: filters[index].ObjectRefId,
                parentDataLevelName: filters[index].ParentDataLevelName,
                parentName: filters[index].ParentName,
                fixtureImageName: filters[index].FixtureImagePath

            });
        }

        /* if filter is type radion then make one selected */
        if (!isMultiSelect) {
            isSetRadio = true;
            //this.setSelectedRadion(filters, filterIdsList, parsedFilters);
        }
        if (parsedFilters.length != 0 && !isSetRadio) {
            parsedFilters[0].isSelected = true;
        }
        return parsedFilters;
    }

    getParsedPropertyList(propertyFilters = []) {
        if (!propertyFilters)
            propertyFilters = [];
        propertyFilters.forEach((item) => {
            item.Items.unshift({
                Name: 'All',
                isSelected: true
            });
            item.Items.forEach((item) => {
                item.isSelected = true;
            });
        });
        return propertyFilters;
    }

    get8XWidgetsOnly(widgets, positions, layoutType) {
        if (layoutType == appConstants.SERVER_MAP) {
            return widgets;
        } else {
            let countWidgets = widgets.length || 0;
            let lenPos = positions.length || 0;
            let x8Widgets = [];
            for (let p = 0; p < lenPos; p++) {
                for (let w = 0; w < countWidgets; w++) {
                    if (widgets[w].Id == positions[p].WidgetId) {
                        x8Widgets.push(widgets[w]);
                        break;
                    }
                }
            }
            return x8Widgets;
        }
    }

    getParsedReferenceLinks(links) {
        let parsedLinks = [];

        if (links.length != 0) {
            parsedLinks.push({
                id: 'all',
                name: 'All',
                displayName: 'All',
                idName: 'all',
                dataLevelName: 'None'
            });
        }

        for (let index = 0; index < links.length; index++) {
            parsedLinks.push({
                dataLevelName: links[index].DataLevelName,
                description: links[index].Description,
                id: links[index].Id,
                isSelected: links[index].IsSeleted,
                name: links[index].Name,
                displayName: links[index].DisplayName,
                objectRefId: links[index].ObjectRefId,
                parentDataLevelName: links[index].ParentDataLevelName,
                parentName: links[index].ParentName,
            });
        }

        return parsedLinks;
    }

    setNullLayout() {
        return {
            Name: '',
            DashBoardSettings: {

            },
            ViewList: {
                '8 X': {
                    MiniWidgetSettings: [],
                    WidgetPositions: [],
                }
            }
        };
    }


     handleResponseData(widgets) {
        let widgetArray: any = null;
        let handledWidgets: any = {};
        let handledObj: any = {};

        try {
            if (widgets) {
                widgetArray = widgets;
                handledWidgets.Widgets = [];
                handledWidgets.MiniWidgets = [];
                if (widgetArray.length != 0) {
                    for (let index = 0; index < widgetArray.length; index++) {
                        handledObj = this.convertToApplicationObj(widgetArray[index]);
                        if (handledObj.type == 'miniWidget') {
                            handledWidgets.MiniWidgets.push(handledObj);
                        } else {
                            /* To set empty object in trendsettings in oldgraph*/
                            if (handledObj.dataSourceIds) {
                                let count = handledObj.dataSourceIds.length;
                                for (let i = 0; i < count; i++) {
                                    if (!handledObj.dataSourceIds[i].trendSettings) {
                                        handledObj.dataSourceIds[i].trendSettings = {}
                                    }
                                }
                            }
                            handledWidgets.Widgets.push(handledObj);
                        }
                    }
                }
            }
        } catch (exception) { }

        return handledWidgets;
    }

      convertToApplicationObj(widget) {
        let handledObj: any = {};
        let imageProperties = null;
        let childWidgets = null;

        handledObj.dataSourceIds = widget.DataSources;
        handledObj.actualDataSourceIds = JSON.parse(JSON.stringify(widget.DataSources));
        handledObj.WidgetId = widget.Id;
        handledObj.isFavourite = widget.IsFavourite;
        handledObj.favouriteLayout = widget.FavouriteLayout;
        handledObj.name = widget.Name;
        handledObj.properties = widget.Properties;
        handledObj.type = widget.Type;
        handledObj.drillDownPath = widget.DrillDownPath;
        handledObj.drillDownFilter = widget.DrillDownFilter;
        handledObj.showLineHierarchy = widget.ShowLineHierarchy;
        handledObj.BackgroundColor = widget.BackgroundColor;
        handledObj.title = widget.Title ? widget.Title : widget.Name;
        handledObj.IsSystemLevel = widget.IsSystemLevel;
        handledObj.DetailLayoutId = widget.DetailLayoutId;
        handledObj.NeedSeperateYCharts = widget.NeedSeperateYCharts;
        handledObj.AxisType = "" + widget.AxisType;
        handledObj.TextAlign = widget.TextAlign;


        if (widget.DetailLayoutId && widget.DetailLayout) {

            let changedwidgets = this.get8XWidgetsOnly(widget.DetailLayout.WidgetList,
                widget.DetailLayout.ViewList['8 X'].WidgetPositions, '') || [];
            let widgets = this.handleResponseData(changedwidgets) || [];

            handledObj.layout = {
                title: widget.DetailLayout.Title,
                widgetLayoutId: widget.DetailLayoutId,
                widgetsList: widgets.MiniWidgets.concat(widgets.Widgets),
                widgetPositions: widget.DetailLayout.ViewList['8 X'].WidgetPositions
            };
        }


        if (handledObj.type == 'miniWidget') {
            handledObj.Function = widget.Function 
        }

        if (handledObj.type == 'imageWidget') {
            imageProperties = JSON.parse(widget.Properties);

            // If image src is in base64 format, donot add the host name
            if (imageProperties.imageSrc.indexOf(';base64') == -1) {
                imageProperties.imageSrc = this.HOST_NAME + imageProperties.imageSrc;
            }
            handledObj.properties = JSON.stringify(imageProperties);
            handledObj.values = JSON.parse(handledObj.properties).imageSrc;
        } else if (handledObj.type == 'tileGroup') {
            handledObj.values = JSON.parse(handledObj.properties);
        } else if (handledObj.type == 'widgetGroup') {
            childWidgets = this.handleResponseData(widget.ChildWidgets || {});
            handledObj.childWidgets = childWidgets.MiniWidgets.concat(childWidgets.Widgets);
        }
        return handledObj;
    }
  // End of GetViewcontent Helper methods

  formatGraphData(responseData) {
    for (var key in responseData) {
      var lenValues = responseData[key].Values.length;
      if (responseData[key].ParameterInfo.fillBoxData) {
        for (var i = 0; i < lenValues; i++) {
          if (responseData[key].Values[i].BoxValue && responseData[key].Values[i].BoxValue.ComputedValues) {
            var boxVal = responseData[key].Values[i].BoxValue.ComputedValues;
            var valArray = [boxVal.BoxMin, boxVal.Q1, boxVal.Q3, boxVal.BoxMax, boxVal.Q2];
            responseData[key].Values[i].YValue = valArray;
          }
        }
        //add whisker point

        //format whisker trendData
        if (responseData[key].ParameterInfo.showTrend) {
          var countTrendValue = responseData[key].TrendValues.length;
          for (var i = 0; i < countTrendValue; i++) {
            if (responseData[key].TrendValues[i].BoxValue && responseData[key].TrendValues[i].BoxValue.ComputedValues) {
              var boxValTrend = responseData[key].TrendValues[i].BoxValue.ComputedValues;
              var valArray = [boxValTrend.BoxMin, boxValTrend.Q1, boxValTrend.Q3, boxValTrend.BoxMax, boxValTrend.Q2];
              responseData[key].TrendValues[i].YValue = valArray;
              responseData[key].Values.push(responseData[key].TrendValues[i])

            }
          }

        }
      }
      if (responseData[key].ParameterInfo.fillBoxData)
        responseData[key].TrendValues = [];
    }

    return responseData;
  }  // End of format widgetdata

  /*
  getParsedHistoryData(chDetail, historyData) {
    var retHistoryData = [];

    for (var key in historyData) {
      retHistoryData.push({
        dataMin: historyData[key].Min,
        dataMax: historyData[key].Max,
        lcl: historyData[key].LCL,
        ucl: historyData[key].UCL,
        computedValues: historyData[key].ComputedValues,
        unit: historyData[key].Unit,
        dataSourceId: key,
        currentLevel: historyData[key].CurrentLevel,
        hasNextLevel: historyData[key].HasNextLevel,
        xAxisIsTime: historyData[key].XAxisIsTime,
        values: this.getHistoryValues(historyData[key], false, false, false, false),
        trendValue: this.getHistoryValues(historyData[key], true, false, false, false),
        trendMinValue: this.getHistoryValues(historyData[key], true, true, false, false),
        trendMaxValue: this.getHistoryValues(historyData[key], true, false, true, false),
        trendAvgValue: this.getHistoryValues(historyData[key], true, false, false, true),
        multiSeriesData: this.formatMultiSeriesData(historyData[key].GroupValues),
        parameterInfo: historyData[key].ParameterInfo,
        shiftTimes: this.getParsedShiftTimes(historyData[key].ShiftTimes),
        useGroupValues: historyData[key].UseGroupValues,

      });
    }

    //TODO
    this.formatTrendValues(retHistoryData);
    return retHistoryData;
  }

  formatTrendValues(retHistoryData) {
    var availablePeriods = this.ddsapService.settings.DefinedTimePeriods;
    var countData = retHistoryData.length;
    var trendPeriod: any = {};
    var diffInMinute = 0;

    for (var i = 0; i < countData; i++) {
      if (retHistoryData[i].parameterInfo.showTrend) {
        var trendName = retHistoryData[i].parameterInfo.trendSettings.TypeName;
        if (trendName == appConstants.CUSTOM_TIME_RANGE_VALUE) {
          diffInMinute = this.utils.millisToMinutesAndSeconds(retHistoryData[i]);
          if (diffInMinute > 0) {
            trendPeriod.IsMinusStart = true;
          } else {
            trendPeriod.IsMinusStart = false;
          }
        } else {
          trendPeriod = this.getPeriodOffsetByName(availablePeriods, trendName);
          diffInMinute = this.getPeriodForTrend({
            Period: trendPeriod.StartOffset
          });
        }


        var lenTrendData = retHistoryData[i].trendValue.length;

        for (var j = 0; j < lenTrendData; j++) {
          if (retHistoryData[i].xAxisIsTime) {
            if (trendPeriod.IsMinusStart) {
              retHistoryData[i].trendValue[j].x = new Date(retHistoryData[i].trendValue[j].x.getTime() + (diffInMinute * 60000)); //minutes to milliseconds
            } else {
              retHistoryData[i].trendValue[j].x = new Date(retHistoryData[i].trendValue[j].x.getTime() - (diffInMinute * 60000)); //minutes to milliseconds
            }

            retHistoryData[i].trendMinValue[j].x = retHistoryData[i].trendValue[j].x;
            retHistoryData[i].trendMaxValue[j].x = retHistoryData[i].trendValue[j].x;
            retHistoryData[i].trendAvgValue[j].x = retHistoryData[i].trendValue[j].x;
          }
        }

      }
    }
  }

  getPeriodForTrend(timePeriod) {

    var offset = timePeriod.Period || "";

    var days = 0;

    // offset will be in this format 1.12:23:25 or 12:23:25

    var parts = offset.split(':');

    var dayHr = parts[0].split('.');
    if (dayHr.length == 2) {
      days = parseInt(dayHr[0]);
    }

    if (days == 0)
      days = 1;

    return days * 24 * 60;
  }

  getPeriodOffsetByName(availablePeriods, name) {
    var countPeriods = availablePeriods.length;
    var trendPeriod = {};
    for (var i = 0; i < countPeriods; i++) {
      if (availablePeriods[i].Name == name) {
        trendPeriod = availablePeriods[i];
        break;
      }
    }
    return trendPeriod;
  }

  getHistoryValues(historyData, isTrend = false, useMin = false, useMax = false, useAvg = false) {
    var retValues = [];
    var xValue = null;
    var key = 'x';
    var values = historyData.Values;
    if (isTrend) {
      values = historyData.TrendValues;
    }
    var dataPointObj: any = {};

    for (var index = 0; index < values.length; index++) {
      dataPointObj = {};
      if (historyData.XAxisIsTime) {

        var xTime = new Date(moment.tz(JSON.parse(values[index].XValue), this.utils.getUserTimeZone()).format('YYYY/MM/DD HH:mm:ss'));

        dataPointObj.x = xTime;
        dataPointObj.formatedTime = this.utils.setDateFormat(xTime);
      } else {
        dataPointObj.label = values[index].XValue;
      }

      dataPointObj.currentLevel = historyData.CurrentLevel;

      if (values[index].YValue.constructor === Array) {
        dataPointObj.y = values[index].YValue;
      } else {

        var yValue = values[index].YValue;

        if (useMin) {
          yValue = values[index].Min;
        }

        if (useMax) {
          yValue = values[index].Max;
        }

        if (useAvg) {
          yValue = values[index].Avg;
        }

        dataPointObj.y = yValue ? parseFloat(yValue.toFixed(2)) : 0;
      }


      dataPointObj.id = values[index].Id;
      if (values[index].UnitId) {
        dataPointObj.unitId = values[index].UnitId;
      }

      if (values[index].UnitLocation) {
        dataPointObj.unitLocation = values[index].UnitLocation;
      }

      //for whiskers
      if (values[index].BoxValue) {
        dataPointObj.BoxValue = values[index].BoxValue;
      }

      if (values[index].hasOwnProperty('UseStringValue')) {
        dataPointObj.useExtras = values[index].UseStringValue;
        if (dataPointObj.useExtras) {
          dataPointObj.extras = this.getParsedStringValue(JSON.parse(values[index].StringValue));
        }
      }

      retValues.push(dataPointObj);
    }

    return retValues;
  }

  getParsedStringValue(extras) {
    var parsedExtras: any = {};

    parsedExtras.title = extras.Title;
    parsedExtras.hasAlarms = extras.HasAlarms;
    parsedExtras.description = extras.Description;

    return parsedExtras;
  }

  formatMultiSeriesData(multiSeriesValues) {
    if (multiSeriesValues) {
      multiSeriesValues.forEach(function (item) {
        item.Values.forEach(function (valueItem) {
          var xTime = new Date(moment.tz(JSON.parse(valueItem.XValue), this.utils.getUserTimeZone()).format('YYYY/MM/DD HH:mm:ss'));
          valueItem.x = xTime;
          valueItem.formatedTime = this.utils.setDateFormat(xTime);
        });
      });
    }

    return multiSeriesValues;
  }

  getParsedShiftTimes(shiftTimes) {
    var parsedShiftTimes = [];

    if (shiftTimes && shiftTimes.length != 0) {
      for (let index = 0; index < shiftTimes.length; index++) {
        parsedShiftTimes.push({
          startTime: new Date(moment.tz(JSON.parse(shiftTimes[index].StartTime), this.utils.getUserTimeZone()).format('YYYY/MM/DD HH:mm:ss')),
          //                    startTime:new Date(JSON.parse(shiftTimes[index].StartTime)),
          endTime: new Date(moment.tz(JSON.parse(shiftTimes[index].EndTime), this.utils.getUserTimeZone()).format('YYYY/MM/DD HH:mm:ss')),
          //                    endTime:new Date(JSON.parse(shiftTimes[index].EndTime)),
          name: shiftTimes[index].Name,
          breakTimes: this.getParsedBreakTimes(shiftTimes[index].BreakTimes)
        });
      }
    }

    return parsedShiftTimes;
  }

  getParsedBreakTimes(breakTimes) {
    var parsedBreakTimes = [];

    if (breakTimes && breakTimes.length != 0) {
      for (let index = 0; index < breakTimes.length; index++) {
        parsedBreakTimes.push({
          startTime: new Date(moment.tz(JSON.parse(breakTimes[index].StartTime), this.utils.getUserTimeZone()).format('YYYY/MM/DD HH:mm:ss')),
          //                    startTime:new Date(JSON.parse(breakTimes[index].StartTime)),
          endTime: new Date(moment.tz(JSON.parse(breakTimes[index].EndTime), this.utils.getUserTimeZone()).format('YYYY/MM/DD HH:mm:ss')),
          //                    endTime:new Date(JSON.parse(breakTimes[index].EndTime)),
          name: breakTimes[index].Name,
        });
      }
    }

    return parsedBreakTimes;
  }

  getFormattedWidgetData(widgets, serverData, callback) {
    var widget = null;

    for (var i = 0; i < widgets.length; i++) {
      widget = widgets[i];

      if (widget.type == 'graph') {
        widget.values = [];
        this.getWigetDataForChart(widget, serverData);

      } else if (widget.type == appConstants.MINI_WIDGET || widget.type == appConstants.IMAGE_WIDGET || widget.type == appConstants.SEPARATOR) {
        this.getWigetDataForMiniTile(widget, serverData);
      }
    }
  }

  getWigetDataForChart(param, serverData) {
    var values = [];
    var target = null;
    var shiftTimes = {};
    var dataSource = null;
    var targetCharFullName = '';
    var trendValues = [];

    param.values = param.values || [];

    if (serverData) {
      for (var j = 0; j < param.dataSourceIds.length; j++) {

        dataSource = param.dataSourceIds[j];

        var period = dataSource.period;
        if (dataSource.customPeriod) {
          period = dataSource.customPeriod;
        }

        dataSource.unit = dataSource.unit ? dataSource.unit : this.getUnitFromServerData(dataSource.id + '.' + period, serverData);

        shiftTimes = this.getShiftTimesFromServerData(dataSource.id + '.' + period, serverData);
        var valFrmServ = this.getValueFromServerData(dataSource.id + '.' + period, dataSource.function, period, dataSource.format, serverData);
        values = valFrmServ.values;

        dataSource.computedValues = valFrmServ.computedValues;
        dataSource.lcl = valFrmServ.lcl;
        dataSource.ucl = valFrmServ.ucl;
        dataSource.dataMin = valFrmServ.dataMin;
        dataSource.dataMax = valFrmServ.dataMax;
        // for trend data 
        if (dataSource.showTrend && dataSource.trendSettings) {
          var trndValFrmServ = this.getValueFromServerData(dataSource.id + '.' + period, dataSource.function, period, dataSource.format, serverData, true);
          var trendValues = trndValFrmServ.values;
          var trendMinValues = trndValFrmServ.minValues;
          var trendMaxValues = trndValFrmServ.maxValues;
          var trendAvgValues = trndValFrmServ.avgValues;

          //Show Trend Values
          if (dataSource.trendSettings.ShowValue) {
            this.addTrendDataSource(param.values, dataSource, "(" + dataSource.trendSettings.TypeName + ")", dataSource.trendSettings.ValueColor, dataSource.trendSettings.ChartType, trendValues, shiftTimes);

          }

          //Show Trend Max
          if (dataSource.trendSettings.ShowMax) {
            this.addTrendDataSource(param.values, dataSource, "(" + dataSource.trendSettings.TypeName + "-Max)", dataSource.trendSettings.MaxColor, dataSource.trendSettings.ChartType, trendMaxValues, shiftTimes);

          }

          //Show Trend Min
          if (dataSource.trendSettings.ShowMin) {
            this.addTrendDataSource(param.values, dataSource, "(" + dataSource.trendSettings.TypeName + "-Min)", dataSource.trendSettings.MinColor, dataSource.trendSettings.ChartType, trendMinValues, shiftTimes);

          }

          //Show Trend Average
          if (dataSource.trendSettings.ShowAvg) {
            this.addTrendDataSource(param.values, dataSource, "(" + dataSource.trendSettings.TypeName + "-Avg)", dataSource.trendSettings.AvgColor, dataSource.trendSettings.ChartType, trendAvgValues, shiftTimes);

          }
        }

        if (values && values.length != 0) {
          param.values.push({
            properties: dataSource,
            values: values,
            shiftTimes: shiftTimes,
            multiSeriesData: valFrmServ.multiSeriesData
          });
        }

        //                Added multiseries data to widgets
        if (valFrmServ.multiSeriesData && valFrmServ.multiSeriesData.length != 0) {
          if (param.values.length == 0) {
            param.values.push({
              properties: dataSource,
              values: values,
              shiftTimes: shiftTimes,
              multiSeriesData: valFrmServ.multiSeriesData,
              useGroupValues: valFrmServ.useGroupValues
            });
          } else {
            param.values[0].multiSeriesData = valFrmServ.multiSeriesData
          }
        }

        if (dataSource.target && dataSource.target.isDataSource) {
          this.addTargetValuesToResponseArray(dataSource, serverData);
        }
      }
    }
  }
*/

/*
  getUnitFromServerData(dataSourceId, serverData) {
    var unit = '';

    for (var index = 0; index < serverData.length; index++) {
      if (dataSourceId == serverData[index].dataSourceId) {
        unit = serverData[index].unit;
        break;
      }
    }

    return unit;
  }

  getShiftTimesFromServerData(dataSourceId, serverData) {
    var shiftTimes = [];

    for (var index = 0; index < serverData.length; index++) {
      if (dataSourceId == serverData[index].dataSourceId) {
        shiftTimes = serverData[index].shiftTimes;
        break;
      }
    }

    return shiftTimes;
  }

  getValueFromServerData(id, functionName, period, format, serverData, isTrend = false) {
    var values = [];
    var minValues = [];
    var maxValues = [];
    var avgValues = [];
    var computedValues = {};
    var lcl = 0;
    var ucl = 0;

    var dataMin = 0;
    var dataMax = 0;
    var multiSeriesData;
    var useGroupValues;

    var retObj = {};

    for (var index = 0; index < serverData.length; index++) {
      if (serverData[index].parameterInfo.id == id && serverData[index].parameterInfo.period == period) {
        //serverData[index].parameterInfo.function == functionName && 
        computedValues = serverData[index].computedValues;
        lcl = serverData[index].lcl;
        ucl = serverData[index].ucl;

        dataMin = serverData[index].dataMin;
        dataMax = serverData[index].dataMax;
        multiSeriesData = serverData[index].multiSeriesData;
        useGroupValues = serverData[index].useGroupValues;

        if (isTrend) {
          values = serverData[index].trendValue;
          minValues = serverData[index].trendMinValue;
          maxValues = serverData[index].trendMaxValue;
          avgValues = serverData[index].trendAvgValue;
        } else {
          values = serverData[index].values;
          minValues = serverData[index].minValues;
          maxValues = serverData[index].maxValues;
          avgValues = serverData[index].avgValues;
        }
        break;
      }
    }

    for (var index = 0; index < values.length; index++) {
      //boxAndWhisker chart Data will be Array
      if (!(values[index].y.constructor === Array)) {
        values[index].y = parseFloat(values[index].y.toFixed(format));
      }

    }

    return {
      computedValues: computedValues,
      lcl: lcl,
      ucl: ucl,
      dataMin: dataMin,
      dataMax: dataMax,
      values: values,
      minValues: minValues,
      maxValues: maxValues,
      avgValues: avgValues,
      multiSeriesData: multiSeriesData,
      useGroupValues: useGroupValues
    };
  }

  addTrendDataSource(target, orignDataSource, legenText, color, chartType, values, shiftTimes) {

    if (values && values.length != 0) {
      var trendDataSource = JSON.parse(JSON.stringify(orignDataSource));
      trendDataSource.chartType = chartType;
      trendDataSource.color = color
      trendDataSource.legendText = trendDataSource.legendText + legenText;
      target.push({
        properties: trendDataSource,
        values: values,
        shiftTimes: shiftTimes
      });
    }
  }

  addTargetValuesToResponseArray(dataSource, serverData) {
    var chVal = null;
    var chFullName = '';
    var chNameWithDevice = '';
    var values = [];

    var valFrmServ = this.getValueFromServerData(dataSource.target.dataSourceId + '.' + dataSource.period, appConstants.TARGET_VALUE_FUNCTION, dataSource.period, dataSource.format, serverData);
    values = valFrmServ.values;
    if (values && values.length != 0) {
      dataSource.target.value = values[0].y;
    }
  }

  getWigetDataForMiniTile(param, serverData) {
    var values = [];
    var target = null;
    var dataSource = null;
    var targetCharFullName = '';

    param.values = param.values || [];

    if (serverData) {
      var countDsIds = param.dataSourceIds ? param.dataSourceIds.length : 0;
      for (var index = 0; index < countDsIds; index++) {
        dataSource = param.dataSourceIds[index];
        var period = dataSource.period;
        if (dataSource.customPeriod) {
          period = dataSource.customPeriod;
        }

        var valFrmServ = this.getValueFromServerData(dataSource.id + '.' + period, dataSource.function, period, dataSource.format, serverData);
        values = valFrmServ.values;
        dataSource.values = valFrmServ.values[0];
        if (values && values.length != 0) {
          param.values = {
            currentLevel: values[0].currentLevel,
            value: values[0].y,
          }
          param.values.useExtras = values[0].useExtras;
          if (values[0].useExtras) {
            param.values.extras = values[0].extras;
          }
        }
        //                if (param.targetValue && param.targetValue.isDataSource) {
        var targetObj = param.dataSourceIds && param.dataSourceIds.length ? param.dataSourceIds[0].target : null;

        if (targetObj && targetObj.isDataSource) {
          var valFrmServ2 = this.getValueFromServerData(targetObj.dataSourceId + '.' + period, appConstants.TARGET_VALUE_FUNCTION, period, dataSource.format, serverData);
          target = valFrmServ2.values;

          if (target.length != 0) {
            targetObj.value = target[0].y;
          }
        }
      }
    }
  }  */

}
