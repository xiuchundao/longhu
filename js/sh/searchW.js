var todaydata1 = get_systemDate_global();
function yearf (srartyear,$htmladd,yesss,morenzhi){
	var year = parseInt(todaydata1.substring(0,4));
	var sysYearDate = '';//start
	if(morenzhi == 1){
		sysYearDate = '<option value="" selected="true">请选择</option>'
	}
	for(var i=year;i>=srartyear; --i){
		if(yesss == i){
			sysYearDate +='<option value="'+yesss+'" selected="true">'+yesss+'年</option>';
		}else{
			sysYearDate +='<option value="'+i+'">'+i+'年</option>';
		}
	}
	$htmladd.html(sysYearDate);
	require(['multipleselect'], function () {
			$htmladd.multipleSelect({
				width : '100%',
				selectAll : false,
				single : true,
				multipleWidth : false,
				maxHeight : 250,
				placeholder : "",
				countSelected : false,
				allSelected : false,
				onClick : function (obj) {
					if (typeof(tableFun) != 'undefined') {
						var objFun = tableFun[obj.label];
						if (objFun != undefined) {
							objFun();
						}
					}
				}
			});
		});
}
$(function(){

	//风险指标
		var myDate = new Date();
		var mon = myDate.getMonth() + 1;
		var year = myDate.getFullYear();
		var day = myDate.getDate();
		var todayDate = myDate.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" +(day<10?"0"+day:day);

		var sysTime = get_systemDate_global();
		//获取时间方法

		var $searchfen = $(".search_fen");
		if($searchfen.length > 0){
			$searchfen.parent().find('.js_tableT01').find(".sse_table_title2").show().find("p").append("<a href='javascript:;' class='download-export'>下载数据<img src='/images/ui/exl-ico-white.png'></a>");
			$searchfen.find('#start_date2').attr("placeholder","查询日期");
			$searchfen.parent().find('.js_tableT01').find(".sse_table_title2").find("p").find("a").click(function(){
				var download = $("#newChange").val().replace(/-/g,"");
				// download = download.trim();

				window.location.href=sseQueryURL+'derivative/downloadRisk.do?trade_date='+download;
			});
			var $search_fenBtn = $searchfen.find('.btn');

			$searchfen.find('#start_date2').val("");//定义变量值

			$search_fenBtn.click(function(){

				var search_fenData = $searchfen.find('#start_date2').val();
				if(search_fenData == '查询日期'){
					search_fenData = '';
				}
				if(search_fenData == ""){
					alert("请输入查询日期！");
					return false;
				}

				$searchfen.parent().find('.js_tableT01').find(".sse_table_title2").find("p").text("数据日期:"+search_fenData);//负值（时间）给更新日期
				$searchfen.parent().find('.js_tableT01').find(".sse_table_title2").find("p").append('<input type="hidden" id="newChange" value="${TRADE_DATE}">');
				$searchfen.parent().find('.js_tableT01').find(".sse_table_title2").show().find("p").append("<a href='javascript:;' class='download-export'>下载数据<img src='/images/ui/exl-ico-white.png'></a>");
				$('.download-export').click(function(){

					//var download = $("#newChange").val().replace(/-/g,"");
					//download = download.trim();
					var download = search_fenData.replace(/-/g,"");
					window.location.href=sseQueryURL+'derivative/downloadRisk.do?trade_date='+download;
				});

				showajaxFen(search_fenData);

			});



			function showajaxFen(begindate){
				var begindate = begindate.split('-');
				var tempData = {
					isPageing:false,
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":false,//是否分页
						"trade_date":begindate.join(""),
						"sqlId":'SSE_ZQPZ_YSP_GGQQZSXT_YSHQ_QQFXZB_DATE_L'
					}
				}

				jQuery.ajax({
					url: tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){

						ajaxSearchFen(dataJson.result);
					},complete:function(){
							hideloading();
					},
					error:function(e){}
				});

			}

			var ajaxSearchFen = function (result){
				var htmlArr = [];

				htmlArr.push('<tr><th>合约编码</th><th>交易代码</th><th>合约简称</th><th>Delta</th><th>Theta</th><th>Gamma</th><th>Vega</th><th>Rho</th>');
				for (var i = 0; i <result.length ; ++i){
					var data = result[i];
					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.SECURITY_ID+'</td>');
					htmlArr.push('<td>'+data.CONTRACT_ID+'</td>');
					htmlArr.push('<td>'+data.CONTRACT_SYMBOL+'</td>');
					htmlArr.push('<td>'+data.DELTA_VALUE+'</td>');
					htmlArr.push('<td>'+data.THETA_VALUE+'</td>');
					htmlArr.push('<td>'+data.GAMMA_VALUE+'</td>');
					htmlArr.push('<td>'+data.VEGA_VALUE+'</td>');
					htmlArr.push('<td>'+data.RHO_VALUE+'</td>');
					htmlArr.push('</tr>');
				}
				if(result.length == 0){
					htmlArr.push('<tr><td  colspan="50">没有查询到数据。</td></tr>');

				}
				$(".sse_table_T01").find('.table').html(htmlArr.join(""));

			}
		}
	//风险指标end

	//交易公开信息

		var $searchdivxin = $(".search_xin");
		if($searchdivxin.length > 0){
			$searchdivxin.siblings('.sse_dl_2').after('<span>查看2006年以前<a href="/disclosure/diclosure/public/seven_index.shtml"  target="_blank">"涨跌幅超过7%的公开信息"</a>信息。</span>');
			var $search_xinBtn = $searchdivxin.find('.btn');
			$searchdivxin.find('.pickerinit').val(todayDate);
			var sse_table_conment = $searchdivxin.siblings('.sse_dl_2');

			//一开始数据的加载
			$.getScript("/js/common/disclosureInformation/disclosure.js",function(){CreateStaticPage("sse_dl_2")});
				function CreateStaticPage(divClass){
					var staticHtml = get_tradeInfoPublishData();

					var htmlArr = staticHtml.split("<br>");
					/* var arr = [];
					$("."+divClass).empty();
					for (var i = 0; i < htmlArr.length; ++i){
						var item = htmlArr[i];

						if(item != "" ){
								arr.push('<p>'+item+'</p>');
						}
					}

					sse_table_conment.html(arr.join("").replace(/\s/g,"&nbsp;")); */
					sse_table_conment.html('<pre>'+staticHtml+'</pre>');
				}

			$search_xinBtn.click(function(){
				var search_xinData = $searchdivxin.find('#start_date2').val();
				if(search_xinData == ""){
					alert("请输入查询日期！")
				}else{
					showajaxin(search_xinData);
				}

			});

			function showajaxin(begindate){

				var tempData = {
					isPageing:true,
					url: sseQueryURL+'infodisplay/showTradePublicFile.do',
					params:{
						"isPagination":false,//是否分页
						"dateTx":begindate
					}
				}

				jQuery.ajax({
					url: tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){
						ajaxSearchXin(dataJson.fileContents);
					},complete:function(){
							hideloading();
						},
					error:function(e){}
				});

			}

			// if($searchdivxin.length != 0){
			// 	showajaxin(todayDate);
			// }  第一屏query加载

			var ajaxSearchXin = function (result){
				var htmlArr = [];
				if(result == null){
					htmlArr.push('<pre>没有查询到数据</pre>');
				}else{
					htmlArr.push('<pre>');
					for (var i = 0; i < result.length; ++i){
						var item = result[i];
						if(item.length != 0 ){
							htmlArr.push(item+'</br>');
						}
					}
					htmlArr.push('</pre>');
				}
				sse_table_conment.html(htmlArr.join(""));
				// $("#aaaa").html(aaaa.replace(/\s/g," "));
			}
		}
	//交易公开信息end

	//每日统计

		var $searchday = $(".search_day");
		if($searchday.length > 0){
			var $search_dayBtn = $searchday.find('.btn');
			var $table01 = $searchday.parent().find('.js_tableT01');

			$table01.find('tr').each(function(){
				var $this = $(this);
				$table01.find('.sse_table_title2').show().find('p').html('数据日期：'+ $this.find('td:first').text());
				$this.find('td:first').hide();
				$this.find('th:first').hide();
			});

			$searchday.find('.pickerinit').val(todayDate);

			$search_dayBtn.click(function(){
				var search_dayData = $searchday.find('.pickerinit').val();
				$table01.find('.sse_table_title2 p').html('数据日期：'+ search_dayData);
				if(search_dayData == ""){
					alert("请输入查询日期！")
				}else{
					showajaxday(search_dayData);
				}
			});

			function showajaxday(begindate){
				var begindate = begindate.split('-');
				var tempData = {
					isPageing:true,
					url: sseQueryURL+'commonQuery.do',
					params:{
						"isPagination":true,//是否分页
						"sqlId":"COMMON_SSE_ZQPZ_YSP_QQ_SJTJ_MRTJ_CX",
						"tradeDate":begindate.join(""),
						"pageHelp.pageSize":5,
						"pageHelp.pageNo":1,
						"pageHelp.beginPage":1,
						"pageHelp.cacheSize":1,
						"pageHelp.endPage":5
					}
				}

				loadPage(tempData,{
					pageSelect:$('.page-con-table')
				},ajaxSearchDay);

			}

			var ajaxSearchDay = function (tableData,obj,results,pageCache){
				var headArr = tableData.header;
				var dataJson = results.dataJson;
				var htmlArr = [];
				htmlArr.push('<tr><th>合约标的<br />代码</th><th>合约标的<br />名称</th><th>总成交量</th><th>认购成交量</th><th>认沽成交量</th><th>认沽/认购</th><th>未平仓<br />合约总数</th><th>未平仓认<br />购合约数</th><th>未平仓认<br />沽合约数</th>');
				if(results. pageCount == 0){
					htmlArr.push('<tr><td  colspan="50">没有查询到数据。</td></tr>');
				}else{

					htmlArr.push('<tr>');
					htmlArr.push('<td>'+dataJson[0].SECURITY_CODE+'</td>');
					htmlArr.push('<td>'+dataJson[0].SECURITY_ABBR+'</td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].TOTAL_VOLUME+'(张)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].CALL_VOLUME+'(张)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].PUT_VOLUME+'(张)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].CP_RATE+'(%)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].LEAVES_QTY+'</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].LEAVES_CALL_QTY+'</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].LEAVES_PUT_QTY+'</div></td>');
					htmlArr.push('</tr>');
				}

				$(".sse_table_T01").eq(0).find('.table').html(htmlArr.join(""));

			}
		}
	//每日END

	//每月
		var $searchmonth = $(".search_month");
		if($searchmonth.length > 0){
			var $search_Btnmonth = $searchmonth.find('.btn');
			var $table02 = $searchmonth.parent().find('.js_tableT01');

			var dataMonth = $table02.find('tr').find('td:first').text();
			var sysTime = get_systemDate_global();
			var monthAll = sysTime.substring("5","7");
			//var monthAll = dataMonth.substring(dataMonth.indexOf("-")+1,dataMonth.length);
			//当前年月
			var optionJ = $(".single_select2").eq(0).find("option");
			var optionM = $("#month_select").find("option");
			//添加年月
			var id = $(".js_tableT01").eq(1).attr("id");
			var datadate = tableData[id].list[1][0];
			var yeardata1 = parseInt(datadate.substring(0,4))
			yearf(1990,$('.single_select2').eq(0),yeardata1);
			$('.single_select').eq(1).find('ul input').eq(parseInt(datadate.substring(5,7))-1).click();
			$('.single_select').eq(1).find('ul input').eq(parseInt(datadate.substring(5,7))-1).click();
			$table02.find('.sse_table_title2').show().find('p').html('数据日期：'+datadate );
			/* for(var i=0;i<optionJ.length;i++){
				if(optionJ[i].value == year){
					$(optionJ[i]).attr("selected","selected");
				}
			}
			for(var i=0;i<optionM.length;i++){
				if(optionM[i].value == monthAll){
					$(optionM[i]).attr("selected","selected");
				}
			} */

			$table02.find('tr').each(function(){
				var $this = $(this);
				/* $table02.find('.sse_table_title2').show().find('p').html('数据日期：'+ $this.find('td:first').text()); */
				$this.find('td:first').hide();
				$this.find('th:first').hide();
			});



			//点击事件
			$search_Btnmonth.click(function(){

				var search_lookDay = $searchmonth.find('.ms-choice').eq(0).find("span").html();
				var search_lookMonth = $searchmonth.find('.ms-choice').eq(1).find("span").html();

				var searchArr = [];
				var dayJ = search_lookDay.substring(0,search_lookDay.length-1)
				searchArr.push(dayJ);
				var monthJ = search_lookMonth.substring(0,search_lookMonth.length-1);
				searchArr.push(monthJ<10?"0"+monthJ:monthJ);
				var search_lookDataMonth = searchArr.join("");

				$table02.find('.sse_table_title2').show().find('p').html('更新日期：'+ searchArr.join("-"));

				showajaxMonth(search_lookDataMonth);
			});

			//传参
			function showajaxMonth(begindate){

				var tempData = {
					isPageing:true,
					url: sseQueryURL+'commonQuery.do',
					params:{
						"isPagination":true,//是否分页
						"sqlId":"COMMON_SSE_ZQPZ_YSP_QQ_SJTJ_YDTJ_CX",
						"tradeDate":begindate,
						"pageHelp.pageSize":10,
						"pageHelp.pageNo":1,
						"pageHelp.beginPage":1,
						"pageHelp.cacheSize":1,
						"pageHelp.endPage":5
					}
				}

				loadPage(tempData,{
					pageSelect:$('.page-con-table')
				},ajaxSearchMonth);

			}

			//画表格
			var ajaxSearchMonth = function (tableData,obj,results,pageCache){
				var headArr = tableData.header;
				var dataJson = results.dataJson;
				var htmlArr = [];
				htmlArr.push('<tr><th>合约标的<br />代码</th><th>合约标的<br />名称</th><th>总成交量</th><th>认购成交量</th><th>认沽成交量</th><th>认沽/认购</th><th>未平仓<br />合约总数</th><th>未平仓认<br />购合约数</th><th>未平仓认<br />沽合约数</th>');

				if(results. pageCount == 0){
					htmlArr.push('<tr><td  colspan="50">没有查询到数据。</td></tr>');
				}else{

					htmlArr.push('<tr>');
					htmlArr.push('<td>'+dataJson[0].SECURITY_CODE+'</td>');
					htmlArr.push('<td>'+dataJson[0].SECURITY_ABBR+'</td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].TOTAL_VOLUME+'(张)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].CALL_VOLUME+'(张)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].PUT_VOLUME+'(张)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].CP_RATE+'(%)</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].LEAVES_QTY+'</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].LEAVES_CALL_QTY+'</div></td>');
					htmlArr.push('<td><div class="align_right">'+dataJson[0].LEAVES_PUT_QTY+'</div></td>');
					htmlArr.push('</tr>');
				}

				$(".sse_table_T01").eq(1).find('.table').html(htmlArr.join(""));

			}
		}
	//每月END

	//涨跌幅超过7%的公开信息息
		var $searchistory = $(".search_historyW");
		if($searchistory.length > 0){
			var ajaxSearchHistory1 = function (result){
				var htmlArr = [];

				htmlArr.push('<tr><th>名次</th><th>证券代码</th><th>证券简称</th><th>涨幅</th><th>成交量(*)</th><th>成交金额</th><th></th>');
				for (var i = 0; i <result.length ; ++i){

					var data = result[i];
					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.NUM+'</td>');
					htmlArr.push("<td><a href=/assortment/stock/list/companyIndex.shtml?COMPANY_CODE="+data.product+"  target='_blank'>"+data.product+"</a></td>");
					htmlArr.push('<td>'+data.productname+'</td>');
					htmlArr.push('<td>'+data.change+'</td>');
					htmlArr.push('<td>'+data.turnover+'</td>');
					htmlArr.push('<td>'+data.tradingamount+'</td>');
					htmlArr.push("<td><a href=/disclosure/diclosure/public/deal_index.shtml?product="+data.product+"&tradeDay="+data.dateTx+" target='_blank'>成交详情</a></td>");

					htmlArr.push('</tr>');
				}
				if(result.length == 0){
					htmlArr.push('<tr><td  colspan="50">没有查询到数据。</td></tr>');
				}
				$(".sse_table_T01").eq(1).find('.table').html(htmlArr.join(""));

			}

			//第二个ajax请求
			function showajaxHistory1(todayDate){

				var tempData = {
					//isPageing:false,
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":true,//是否分页
						"searchDate":todayDate,
						"sqlId":'COMMON_SSE_XXPL_JYXXPL_JYGKXX_LOWRANG_S'
					}
				}

				jQuery.ajax({
					url: tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){
						ajaxSearchHistory1(dataJson.result);

					},complete:function(){
							hideloading();
						},
					error:function(e){}
				});

			}

			var ajaxSearchHistory = function (result){
				var htmlArr = [];

				htmlArr.push('<tr><th>名次</th><th>证券代码</th><th>证券简称</th><th>涨幅</th><th>成交量(*)</th><th>成交金额</th><th></th>');
				for (var i = 0; i <result.length ; ++i){
					//var count = result.length;
					var data = result[i];
					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.NUM+'</td>');
					htmlArr.push("<td><a href=/assortment/stock/list/companyIndex.shtml?COMPANY_CODE="+data.product+"  target='_blank'>"+data.product+"</a></td>");
					htmlArr.push('<td>'+data.productname+'</td>');
					htmlArr.push('<td>'+data.change+'</td>');
					htmlArr.push('<td>'+data.turnover+'</td>');
					htmlArr.push('<td>'+data.tradingamount+'</td>');
					htmlArr.push("<td><a href=/disclosure/diclosure/public/deal_index.shtml?product="+data.product+"&tradeDay="+data.dateTx+"  target='_blank'>成交详情</a></td>");

					htmlArr.push('</tr>');
				}
				if(result.length == 0){
					htmlArr.push('<tr><td  colspan="50">没有查询到数据。</td></tr>');
				}
				$(".sse_table_T01").eq(0).find('.table').eq(0).html(htmlArr.join(""));

			}
			//第一个ajax请求
			function showajaxHistory2(todayDate){

				var tempData = {
					//isPageing:false,
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":true,//是否分页
						"searchDate":todayDate,
						"sqlId":'COMMON_SSE_XXPL_JYXXPL_JYGKXX_OUTRANG_S'
					}
				}

				jQuery.ajax({
					url: tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){

						ajaxSearchHistory(dataJson.result);
					},complete:function(){
							hideloading();
					},
					error:function(e){}
				});

			}

			var $search_historyBtn = $searchistory.find('.btn');
			$('#start_date2').val(todayDate);
			$search_historyBtn.click(function(){
				var search_historyData = $('#start_date2').val();

				if(search_historyData == ""){
					alert("请输入查询日期！");
				}else{
					showajaxHistory2(search_historyData);
					showajaxHistory1(search_historyData);
				}

			});

		}
	//涨跌幅超过7%的公开信息end


	//交易总览
		var $searchZon = $(".search_zon");
		if($searchZon.length != 0){
			var $search_zonBtn = $searchZon.find('.btn');
			$search_zonBtn.click(function(){
				var searchVal = $searchZon.find("#inputCode").val();
				var reg = /^\d+$/;

				if(searchVal.length==6 && reg.test(searchVal)){
					window.location.href='/assortment/stock/list/info/company/index.shtml?COMPANY_CODE='+searchVal;
				}else{
					alert("证券代码必须为6位数字！");
				}

			});
		}
	//交易总览End


	//获取url参数
	function GetQueryString(name){
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		 var r = window.location.search.substr(1).match(reg);
		 if(r!=null){
			return  unescape(r[2]);
		}else{
			return null;
		}
	}
	//分级LOF基金
		var $searchistory = $(".search_fj");
		if($searchistory.length > 0){
			var ajaxSearchHistory = function (result){
				var htmlArr = [];
				var showArr = [];

				showArr.push('<div class="searchW-title">')
					showArr.push('<span>基金管理人:</span>');
					showArr.push('<span><a href="/assortment/fund/fjlof/home/index_list.shtml?COMPANYNAME='+result[0].MANAGER_NAME+'" target="_blank">'+result[0].MANAGER_NAME+'</a></span>');
				showArr.push('</div>');
				showArr.push('<div class="searchW-title">')
					showArr.push('<span>基金托管人:</span>');
					showArr.push('<span>'+result[0].TRUSTEE_NAME+'</span>');
				showArr.push('</div>');


				htmlArr.push('<tr><th>代码</th><th>简称</th><th>基金类别</th><th>转换系数</th><th>上市时间</th>');
				for (var i = 0; i <result.length ; ++i){
					var data = result[i];
					$(".sse_title_common").find("h2").html(data.ABBR+" "+data.FUNDID);

					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.FUNDID+'</td>');
					htmlArr.push('<td>'+data.ABBR+'</td>');
					htmlArr.push('<td>'+data.PRODUCT_TYPE+'</td>');
					htmlArr.push('<td>'+data.MASTER_RATIO+'</td>');
					htmlArr.push('<td>'+data.LISTING_DATE+'</td>');
					htmlArr.push('</tr>');

					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.SUB_CODE1+'</td>');
					htmlArr.push('<td>'+data.SUB_ABBR1+'</td>');
					htmlArr.push('<td>'+data.PRODUCT_TYPE1+'</td>');
					htmlArr.push('<td>'+data.SUB1_RATIO+'</td>');
					htmlArr.push('<td>'+data.LISTING_DATE1+'</td>');
					htmlArr.push('</tr>');

					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.SUB_CODE2+'</td>');
					htmlArr.push('<td>'+data.SUB_ABBR2+'</td>');
					htmlArr.push('<td>'+data.PRODUCT_TYPE2+'</td>');
					htmlArr.push('<td>'+data.SUB2_RATIO+'</td>');
					htmlArr.push('<td>'+data.LISTING_DATE2+'</td>');
					htmlArr.push('</tr>');
				}
				if(result.length == 0){
					htmlArr.push('<tr><td  colspan="50">没有查询到数据。</td></tr>');
				}
				//$(".js_tableT01").find("table").eq(0).show().html(showArr.join(""));
				$(".js_tableT01").prepend(showArr.join(""));
				$(".js_tableT01").find("table").show().html(htmlArr.join(""));
			}

			var urlProductid = GetQueryString("FUNDID");

			function showajaxHistory(urlProductid){
				var tempData = {
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":false,//是否分页
						"sqlId":'COMMON_SSE_ZQPZ_JJLB_FJLOF_L',
						"FUNDID":urlProductid,
						"ABBR":"x"
					}
				};

				jQuery.ajax({
					url:tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){
						ajaxSearchHistory(dataJson.result);
					},
					error:function(e){}
				});

			}
			showajaxHistory(urlProductid);

		}
	//分级LOF基金end

});

$(function(){
	//获取url参数
	function GetQueryString(name){
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		 var r = window.location.search.substr(1).match(reg);
		 if(r!=null){
			return  unescape(r[2]);
		}else{
			return null;
		}
	}
	//上市开放式基金（LOF）
		var $searcfjhome = $(".search_fjhome");
		if($searcfjhome.length > 0){
			//var urlProductid = GetQueryString("COMPANY_CODE");
			//var COMPANYNAME = getValue('FULLNAME'); //获取url地址
			var urlProductid = GetQueryString("FUNDID");
			var COMPANYNAME = getValue('ABBR'); //获取url地址
			var urlProductname = decodeURIComponent(COMPANYNAME);	//url乱码编译
			// var Productname = GetQueryString("FULLNAME");
			// var urlProductname = decodeURIComponent("Productname");

			function showajaxHistory(urlProductid){
				var tempData = {
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":false,//是否分页
						"sqlId":'COMMON_SSE_ZQPZ_JJLB_LOF_L',
						"FUNDID":urlProductid,
						"ABBR":"random"
					}
				};

				jQuery.ajax({
					url:tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){
						ajaxSearchHistory(dataJson.result);
					},
					error:function(e){}
				});

			}
			showajaxHistory(urlProductid);

			var ajaxSearchHistory = function (result){
				var htmlArr = [];
				if(result == null || result == 0){
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金代码:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金简称:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>上市时间:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金管理人:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金托管人:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					$(".sse_title_common").find("h2").html(urlProductname + urlProductid);//改h2标题
					$searcfjhome.html(htmlArr.join(""));
				}else{
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金代码:</td>');
						htmlArr.push('<td>'+result[0].FUNDID+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金简称:</td>');
						htmlArr.push('<td>'+result[0].ABBR+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>上市时间:</td>');
						htmlArr.push('<td>'+result[0].LISTING_DATE+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金管理人:</td>');
						htmlArr.push('<td><a href=/assortment/fund/fjlof/home/index_list.shtml?COMPANYNAME='+result[0].MANAGER_NAME+' target="_blank">'+result[0].MANAGER_NAME+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>基金托管人:</td>');
						htmlArr.push('<td>'+result[0].TRUSTEE_NAME+'</td>');
					htmlArr.push('</tr>');
					$(".sse_title_common").eq(0).find("h2").html(result[0].ABBR + result[0].FUNDID);//改h2标题
					$searcfjhome.html(htmlArr.join(""));
				}

			}
		}
	//上市开放式基金（LOF）end
});


$(function(){
	//获取url参数
	function GetQueryString(name){
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

		 var r = window.location.search.substr(1).match(reg);

		 if(r!=null){
			return  unescape(r[2]);
		}else{
			return null;
		}
	}

	//分级LOF基金&上市开放式基金（LOF）详细
		var $searcfjdata = $(".search_fjdata");
		if($searcfjdata.length > 0){
			var COMPANYNAME = getValue('COMPANYNAME'); //获取url地址
			var urlProductid = decodeURIComponent(COMPANYNAME)	//url乱码编译
			var urlProductid2 = urlProductid.substring(0,4);

			function showajaxHistory(urlProductid){
				var tempData = {
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":false,//是否分页
						"sqlId":'COMMON_SSE_ZQPZ_JJGSLB_JJGLGSGK_GSJBXX_C',
						"COMPANYNAME":urlProductid2
					}
				};
				var tempData2 = {
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":false,//是否分页
						"sqlId":'COMMON_SSE_ZQPZ_JJLB_XX_HOMEPAGEINFO',
						"COMPANYNAME":urlProductid
					}
				};

				var one = "";
				var two = "";
				$.ajax({
					url:tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					data:tempData.params,
					async:false,
					cache : false,
					success:function(dataJson){
						var imgdata = {};
						$.ajax({
							url:tempData2.url,
							type:"post",
							dataType: "jsonp",
							jsonp:'jsonCallBack',
							jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
							data:tempData2.params,
							async:false,
							cache : false,
							success:function(dataJson2){
								two = dataJson2.result;
								ajaxSearchHistory(one,two);
							}
						});
						one = dataJson.result;
					},
					error:function(e){}
				});
			}
			showajaxHistory(urlProductid2);

			var ajaxSearchHistory = function (result,imgdata){
				var htmlArr = [];
				if(result[0] == null){
					htmlArr.push('<tr>')
					htmlArr.push('<td>单位全称:</td>');
					htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>注册地址:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>总经理:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>联系人:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>联系电话:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>联系传真:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>公司网址:</td>');
						htmlArr.push('<td>-</td>');
					htmlArr.push('</tr>');

					$searcfjdata.html(htmlArr.join(""));
				}else{
					htmlArr.push('<tr>')
					htmlArr.push('<td>单位全称:</td>');
						htmlArr.push('<td>'+result[0].COMPANYNAME+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>注册地址:</td>');
						htmlArr.push('<td>'+result[0].COMPANYADDR+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>总经理:</td>');
						htmlArr.push('<td>'+result[0].GMNAME+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>联系人:</td>');
						htmlArr.push('<td>'+result[0].CONTACTNAME+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>联系电话:</td>');
						htmlArr.push('<td>'+result[0].CONTACTPHONE+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>联系传真:</td>');
						htmlArr.push('<td>'+result[0].CONTACTFAX+'</td>');
					htmlArr.push('</tr>');
					htmlArr.push('<tr>')
						htmlArr.push('<td>公司网址:</td>');
						htmlArr.push('<td><a href=http://'+imgdata[0].HOMEPAGE+'>'+imgdata[0].HOMEPAGE+'</td>');
					htmlArr.push('</tr>');

					$searcfjdata.html(htmlArr.join(""));
				}

			}
		}
	//分级LOF基金&上市开放式基金（LOF）详细end

});
$(function(){
	var $study = $(".con_block").find(".study");
	if( ! $study.length<1){
		$study.find(".single_select2").html('<option value="" selected="selected">请选择</option><option value="">全部</option><option value="1" >最近一天</option><option value="2" >最近一周</option><option value="3" >最近一个月</option><option value="4" >最近三个月</option>'+
		'<option value="5">最近半年</option><option value="6" >最近一年</option><option value="7" >最近三年</option>');
		require(['multipleselect'], function () {
				$('#single_select_2').multipleSelect({
					width: '100%',
					selectAll: false,
					single: true,
					multipleWidth: false,
					maxHeight: 250,
					placeholder: "请选择",
					countSelected: false,
					allSelected: false,
					onClick: function (obj) {
						if (typeof (tableFun) != 'undefined') {
							var objFun = tableFun[obj.label];
							if (objFun != undefined) {
								objFun();
							}
						}
					}
				});
				//下拉框的选中值可以按如下方式获取,注意要加id属性
				// var single_select_1 = $('#single_select_1').multipleSelect('getSelects');
				// console.log(single_select_1);
		});
	}
});
//ETF规模
	$(function(){
		var $searcetf = $(".search_etf");
		if($searcetf.length > 0){
			var sysTime = get_systemDate_global();
			$searcetf.find("#start_date2").val(sysTime);

			var searcetf_btn = $searcetf.parent().find(".btn");//按钮
			searcetf_btn.click(function(){
				var  searcetf_time = $searcetf.find("#start_date2").val();
				//$searcetf.find("#start_date2").val(searcetf_time);
				showajaxEtf(searcetf_time);
			});

			//ajax
			function showajaxEtf(searcetf_time){
				var tempData = {
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":true,//是否分页
						"sqlId":'COMMON_SSE_ZQPZ_ETFZL_XXPL_ETFGM_SEARCH_L',
						"pageHelp.pageSize":10000,
						"STAT_DATE":searcetf_time
					}
				};

				jQuery.ajax({
					url:tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					async:false,
					cache : false,
					data:tempData.params,
					success:function(dataJson){
						ajaxSearchEtf(dataJson.result);

					},complete:function(){
							hideloading();
						},
					error:function(e){}
				});
			}
			//数据填充
			var ajaxSearchEtf = function (result){
				var htmlArr = [];

				htmlArr.push('<tr><th>日期</th><th>基金代码</th><th>基金简称</th><th>总份额（亿份）</th>');
				for (var i = 0; i <result.length ; ++i){
					var data = result[i];
					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.STAT_DATE+'</td>');
					htmlArr.push('<td>'+data.SEC_CODE+'</td>');
					htmlArr.push('<td>'+data.SEC_NAME+'</td>');
					htmlArr.push('<td><div class="align_right">'+data.TOT_VOL+'</div></td>');
					htmlArr.push('</tr>');
				}
				if(result.length == 0){
					htmlArr.push('<tr><td  colspan="50">对不起! 共找到0条记录</td></tr>');
				}
				$(".sse_table_T01").find('.table').html(htmlArr.join(""));
			}

		}
	});
//ETF规模END

//基金规模
	$(function(){
		var $searcfund = $(".search_fund");
		if($searcfund.length > 0){
			var sysTime = get_systemDate_global();
			// $searcfund.find("#start_date2").val(sysTime);

			var $table01 = $searcfund.parent().find('.js_tableT01');
			$table01.find('tr').each(function(){
				var $this = $(this);
				$searcfund.find("#start_date2").attr("placeholder","查询日期");
				//$table01.find('.sse_table_title2').show().find('p').html('数据日期：'+ $this.find('td:first').text());
				// $this.find('td:first').hide();
				// $this.find('th:first').hide();
			});

			var searcfund_btn = $searcfund.parent().find(".btn");//按钮
			searcfund_btn.click(function(){
				var  searcfund_time = $searcfund.find("#start_date2").val();
				if (searcfund_time =="" || searcfund_time =="查询日期"){
					alert("请输入查询日期。");
				}else if (searcfund_time < "1990-12-19") {
					alert("您选择的日期超出检索范围，请重输。");
				} else if (searcfund_time > get_systemDate_global()) {
					alert("您选择的日期超出检索范围，请重输。");
				} else {
					showajaxEtf(searcfund_time);
				}

			});
			//ajax
			function showajaxEtf(searcfund_time){
				var tempData = {
					url: sseQueryURL + 'commonQuery.do',
					params:{
						"isPagination":true,//是否分页
						"sqlId":'COMMON_SSE_ZQPZ_ETFZL_XXPL_ETFGM_JYXJJ_SEARCH_L',
						"pageHelp.pageSize":10000,
						"STAT_DATE":searcfund_time
					}
				};
				showloading();
				jQuery.ajax({
					url:tempData.url,
					type:"post",
					dataType: "jsonp",
					jsonp:'jsonCallBack',
					jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
					async:false,
					cache : false,
					data:tempData.params,
					success:function(dataJson){
						ajaxSearchEtf(dataJson.result);
						hideloading();
					},complete:function(){
							hideloading();
						},
					error:function(e){}
				});
			}
			//数据填充
			var ajaxSearchEtf = function (result){
				var htmlArr = [];
				htmlArr.push('<tr><th>日期</th><th>基金代码</th><th>基金简称</th><th>总份额（亿份）</th>');
				for (var i = 0; i <result.length ; ++i){
					var data = result[i];
					htmlArr.push('<tr>');
					htmlArr.push('<td>'+data.STAT_DATE+'</td>');
					htmlArr.push('<td><a target="_blank" href="/assortment/fund/list/tcurrencyfundinfo/basic/index.shtml?FUNDID='+data.SEC_CODE+'&FULLNAME='+data.SEC_NAME+'">'+data.SEC_CODE+'</td>');
					htmlArr.push('<td>'+data.SEC_NAME+'</td>');
					htmlArr.push('<td><div class="align_right">'+data.TOT_VOL+'</div></td>');
					htmlArr.push('</tr>');
				}
				if(result.length == 0){
					htmlArr.push('<tr><td  colspan="50">对不起! 共找到0条记录</td></tr>');
				}
				$(".sse_table_T01").find('.table').html(htmlArr.join(""));
			}
		}
	});
//基金规模END
$(function () {
    if (!placeholderSupport()) {
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() === '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholderSupport');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    }
});
