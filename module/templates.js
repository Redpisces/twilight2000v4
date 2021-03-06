
/**
 * Defines a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  let templates=[];

  
  return loadTemplates([
    // Shared Partials
    // 'templates/dice/roll.html',

    // Actor Sheet Partials
    'systems/twilight2000v4/templates/actor/part/attribute-slot.hbs',

    'systems/twilight2000v4/templates/actor/part/gear-list.hbs',
    'systems/twilight2000v4/templates/actor/part/gear-slot.hbs',

    'systems/twilight2000v4/templates/actor/part/weapon-list.hbs',
    'systems/twilight2000v4/templates/actor/part/weapon-slot.hbs',

    'systems/twilight2000v4/templates/actor/part/armor-list.hbs',
    'systems/twilight2000v4/templates/actor/part/armor-slot.hbs',

    'systems/twilight2000v4/templates/actor/part/skill-slot.hbs',


    'systems/twilight2000v4/templates/item/blocks/gear-block.hbs',
    'systems/twilight2000v4/templates/actor/part/armor-display.hbs',
    'systems/twilight2000v4/templates/actor/part/morale-display.hbs',
    'systems/twilight2000v4/templates/actor/part/resource-display.hbs',
    'systems/twilight2000v4/templates/actor/part/gear-controls.hbs',
    'systems/twilight2000v4/templates/actor/part/prod-block.hbs',
    'systems/twilight2000v4/templates/actor/part/weapon-display.hbs',
    'systems/twilight2000v4/templates/item/blocks/attribute-select.hbs',
    'systems/twilight2000v4/templates/item/blocks/skill-select.hbs'

  ]);
}

export function registerHandlebars() {
  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function () {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
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

  Handlebars.registerHelper('find', function(collection,id){
    var collectionLength = collection.length;

    for (var i = 0; i < collectionLength; i++) {
      if (collection[i]._id === id) {
        return collection[i];
      }

    }

    return null;
  })

  Handlebars.registerHelper('getIndex', function (collection, id) {
    var collectionLength = collection.length;

    for (var i = 0; i < collectionLength; i++) {
      if (collection[i]._id === id) {
        return i;
      }

    }

    return null;
  })

}

