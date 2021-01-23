
/**
 * Defines a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
	return loadTemplates([
		// Shared Partials
		// 'templates/dice/roll.html',

		// Actor Sheet Partials
		'systems/twilight2000v4/templates/actor/part/attribute-slot.hbs',
		
		'systems/twilight2000v4/templates/actor/part/gear-list.hbs',
		
		'systems/twilight2000v4/templates/actor/part/skill-slot.hbs',
		'systems/twilight2000v4/templates/actor/part/gear-slot.hbs'
	]);
}

export function registerHandlebars(){
	// If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
  
  Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
  });
	
  Handlebars.registerHelper("comp", function(lvalue,operator,rvalue,options){
	lvalue = parseFloat (lvalue);  
	rvalue = parseFloat (rvalue);
	
	return {
		">": lvalue > rvalue,
		"<": lvalue < rvalue,
		"=": lvalue == rvalue,
		"!=": lvalue != rvalue,
		">=": lvalue >= rvalue,
		"<=": lvalue <= rvalue
	}[operator];
  });
}
		