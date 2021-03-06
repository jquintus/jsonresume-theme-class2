var fs = require("fs");
var Handlebars = require("handlebars");

function getMonth(date) {
  switch (date.substr(5,2)) {
    case '01': return "January";
    case '02': return "February";
    case '03': return "March";
    case '04': return "April";
    case '05': return "May";
    case '06': return "June";
    case '07': return "July";
    case '08': return "August";
    case '09': return "September";
    case '10': return "October";
    case '11': return "November";
    case '12': return "December";
  }
}

function createReadableDates(entry){
  if (!entry) return;

  entry.forEach(function(w) {
    if (w.startDate){
      var startDateYear = (w.startDate || "").substr(0,4);
      var startDateMonth = getMonth(w.startDate || "");

      w.startDateReadable = startDateMonth + " " + startDateYear;
    }

    if (w.endDate){
      var endDateYear = (w.endDate || "").substr(0,4);
      var endDateMonth = getMonth(w.endDate || "");
      w.endDateReadable = endDateMonth + " " + endDateYear;
    }
    else
    {
      w.endDateReadable = "Present";
    }
  });
}

function addTodaysDate(resume){
  var today = new Date();
  resume.basics.today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

function render(resume) {

  createReadableDates(resume.work);
  createReadableDates(resume.education);
  createReadableDates(resume.volunteer);
  
  addTodaysDate(resume);

	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var template = fs.readFileSync(__dirname + "/resume.template", "utf-8");

  Handlebars.registerHelper('commaList', function (items, options){
    var out = '';
    for (var i = 0, l=items.length; i<l; i++){
      var item = items[i];
      out = out + options.fn(item).trim() + (i !==(l-1)? ", ": "");
    }
    return out;
  });
	return Handlebars.compile(template)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};
