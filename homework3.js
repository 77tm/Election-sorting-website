/*
 * Toms Madžuls tm22005
 */
 
function capitalize (str) { // implement a function to capitalize the first letter of every word in str 
	var arr = str.toLowerCase().split("-");
	var capitalized = arr.map(
		function(firstLetter){
			return firstLetter.replace(firstLetter.charAt(0), firstLetter.charAt(0).toUpperCase());
		});
	return capitalized.join(" ");
}

 
window.addEventListener('DOMContentLoaded', (event) => { // execute the code when the initial HTML document has been completely loaded, we need the regions select to be loaded 
    
	var lookup = {};

	for (let i in activities) { // for every item in the activities - every piece of statistic info
		let region;
		if (activities[i].Location.ParentId) 
			region = capitalize(activities[i].Location.ParentId); // read region from an activity
		else 
			region = capitalize(activities[i].Location.Id); // read polling station Id from an activity
		let station = activities[i].Location.Name; // read polling station from an activity
		if (region && !(region in lookup)) { // if the region hasn't been previously processed
			lookup[region] = {}; // add a new region to the lookup
		}
		lookup[region][station] = 1; // add a station to the lookup. lookup is a two-dimensional associative array/object
	}

	//console.log(lookup); // uncomment this line if you want to see the result in the console

	// now let's get regions for the first select element
	var regions = Object.keys(lookup).sort(); // get the list of keys in the lookup and sort it

	//console.log(regions); // uncomment this line if you want to see the result in the console
	
	var region_s = document.getElementById("region-list"); // get region select element
	for (let i in regions) { // for every region
		let opt = document.createElement('option'); // create a new option		
		opt.innerHTML = regions[i]; // fill the text with the region name
		opt.value = regions[i]; // fill the value with the region name
		region_s.appendChild(opt); // add newly created option to the region select
	}

	// to get polling stations for the first region and sort it
	var stations = [];
	for (let i = 0; i < regions.length; i++){
		stations.push(Object.keys(lookup[regions[i]]));
	}
	stations = (stations.flat()).sort();

	//console.log(stations); // uncomment this line if you want to see the result in the console
	
	// write your code to fill the polling stations select element
	var station_s = document.getElementById("polling-list");
	for (let i in stations) { 
		let opt = document.createElement('option');
		opt.innerHTML = stations[i];
		opt.value = stations[i];
		station_s.appendChild(opt);
	}

	function makeTotalData(reg, name, add, tv, vc, pv){
		var obj = {
			region: reg,
			name: name,
			address: add,
			totalVoters: tv,
			voteCount: vc,
			percentageVoted: pv
		};
		return obj;
	}

	function makeElectDayData(reg, name, add, edv, edp){
		var obj = {
			region: reg,
			name: name,
			address: add,
			electionDayVoteCount: edv,
			percentageVotedOnElectionDay: edp
		};
		return obj;
	}

	function getTotalData(akt){
		let array = [];
		for (let i in akt){
			let reg = akt[i]["Location"]["ParentId"];
			let name = akt[i]["Location"]["Name"];
			let add = akt[i]["Location"]["Address"];
			let tv = akt[i]["Location"]["VoterCount"];
			let vc = akt[i]["TotalStatistic"]["Count"];
			let pv = akt[i]["TotalStatistic"]["Percentage"] + '%';
			let edv = akt[i]["ElectionDayTotalStatistic"]["Count"];
			let edp = akt[i]["ElectionDayTotalStatistic"]["Percentage"] + '%';
			
			reg = capitalize(String(reg));
			array.push(makeTotalData(reg, name, add, tv, vc, pv));
		}
		array.sort(function(a, b){
			if (a.region.toLowerCase() < b.region.toLowerCase()) return -1;
			if (a.region.toLowerCase() > b.region.toLowerCase()) return 1;
			return 0;
		});
		return array;
	}

	function getElectDayData(akt){
		let array = [];
		for (let i in akt){
			let reg = akt[i]["Location"]["ParentId"];
			let name = akt[i]["Location"]["Name"];
			let add = akt[i]["Location"]["Address"];
			let tv = akt[i]["Location"]["VoterCount"];
			let vc = akt[i]["TotalStatistic"]["Count"];
			let pv = akt[i]["TotalStatistic"]["Percentage"] + '%';
			let edv = akt[i]["ElectionDayTotalStatistic"]["Count"];
			let edp = akt[i]["ElectionDayTotalStatistic"]["Percentage"] + '%';
		
			reg = capitalize(String(reg));
			array.push(makeElectDayData(reg, name, add, edv, edp));
		}
		array.sort(function(a, b){
			if (a.region.toLowerCase() < b.region.toLowerCase()) return -1;
			if (a.region.toLowerCase() > b.region.toLowerCase()) return 1;
			return 0;
		});
		return array;
	}

	function generateTableHead(table, data) {
		let thead = table.createTHead();
		let row = thead.insertRow();
		for (let key of data){
			let th = document.createElement("th");
			let text = document.createTextNode(key);
			th.appendChild(text);
			row.appendChild(th);
		}
	}

	function generateTable(table, data){
		for (let element of data){
			let row = table.insertRow();
			for(key in element){
				let cell = row.insertCell();
				let text = document.createTextNode(element[key]);
				cell.appendChild(text);
			}
		}
	}

	let table = document.querySelector("table");
	let thTotal = ["Region", "Name", "Address", "Total Voters", "Vote Count", "Percentage Voted"];
	let thElectionDay = ["Region", "Name", "Address", "Election Day Vote Count", "Percentage Voted on Election Day"];

	function votersAlert() {
		let votersFrom = document.getElementById("vote-from");
		let votersUntil = document.getElementById("vote-until");
		if (votersFrom.value < 0 || votersUntil.value < 0 ) {
			alert("Voter count can not be negative!");
		} 
	}

	function chosenRegion(data){
		let region_value = document.getElementById("region-list").value;
		let arr = [];
		for (let i in data){
			if (data[i]['region'] == region_value){
				arr.push(data[i]);
			}
		}
		return arr;
	}

	function chosenStation(data){
		let polling_value = document.getElementById("polling-list").value;
		let arr = [];
		for (let i in data){
			if (data[i]['name'] == polling_value){
				arr.push(data[i]);
			}
		}
		return arr;
	}

	function makeVoterData(data){
		let voteriFrom = document.getElementById("vote-from").value;
		let voteriUntil = document.getElementById("vote-until").value;
		let arr = [];
		if(voteriFrom != ''){
			if(voteriUntil != ''){
				for (let i in data){ //VOTER COUNT UZ totalVoters
					if (data[i]['totalVoters'] >= voteriFrom && data[i]['totalVoters'] <= voteriUntil ){
						arr.push(data[i]);
					}
				}
			}
			if(voteriUntil == ''){
				for (let i in data){
					if (data[i]['totalVoters'] >= voteriFrom){
						arr.push(data[i]);
					}
				}
			}
		}
		if(voteriFrom == ''){
			if(voteriUntil != ''){
				for (let i in data){
					if (data[i]['totalVoters'] <= voteriUntil ){
						arr.push(data[i]);
					}
				}
			}
			if(voteriUntil == ''){
				arr = data;
			}
		}
		return arr;
	}
	
	function buttonClicked(){
		table.innerHTML = ""; //reset table
		let region_value = document.getElementById("region-list").value;
		let polling_value = document.getElementById("polling-list").value;
		let radioButton;
		let votersFrom = document.getElementById("vote-from");
		let votersUntil = document.getElementById("vote-until");
		let electionDayData = getElectDayData(makeVoterData(activities)); 
		let totalData = getTotalData(activities);

		if(document.getElementById("elect-day").checked){
			radioButton = electionDayData;
		}
		if(document.getElementById("total").checked){
			radioButton = totalData;
		}

		let afterVotersSorted = makeVoterData(radioButton);
		
		if (votersFrom.value < 0 || votersUntil.value < 0 ){
			votersAlert()
		}else{
			let radamaisObj;
			let radamaisObj1;
			if (region_value != ''){
				radamaisObj = chosenRegion(afterVotersSorted);
				if (polling_value != ''){
					radamaisObj1 = chosenStation(radamaisObj);
					if (document.getElementById("total").checked){
						tbody = generateTable(table, radamaisObj1);
						thead = generateTableHead(table, thTotal);
					}
					if (document.getElementById("elect-day").checked){
						tbody = generateTable(table, radamaisObj1);
						thead = generateTableHead(table, thElectionDay);
					}
				}
				if (polling_value == ''){
					if (document.getElementById("total").checked){
						tbody = generateTable(table, radamaisObj); 
						thead = generateTableHead(table, thTotal);
					}
					if (document.getElementById("elect-day").checked){
						tbody = generateTable(table, radamaisObj); 
						thead = generateTableHead(table, thElectionDay);
					}
				}
			}
			if (region_value == ''){
				if (polling_value != ''){
					radamaisObj1 = chosenStation(afterVotersSorted);
					if (document.getElementById("total").checked){
						tbody = generateTable(table, radamaisObj1); 
						thead = generateTableHead(table, thTotal);
					}
					if (document.getElementById("elect-day").checked){
						tbody = generateTable(table, radamaisObj1); 
						thead = generateTableHead(table, thElectionDay);
					}
				}
				if (polling_value == ''){
					if (document.getElementById("total").checked){
						tbody = generateTable(table, afterVotersSorted); 
						thead = generateTableHead(table, thTotal);
					}
					if (document.getElementById("elect-day").checked){
						tbody = generateTable(table, afterVotersSorted);
						thead = generateTableHead(table, thElectionDay);
					}
				}
			}
		}
	}
	document.getElementById("show-stats").addEventListener("click", buttonClicked);
});