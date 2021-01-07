// Import Modules
import { twilightActor } from "./actor/actor.js";
import { twilightActorSheet } from "./actor/actor-sheet.js";
import { twilightItem } from "./item/item.js";
import { twilightItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.twilight2000v4 = {
    twilightActor,
    twilightItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d@cuf.die+1d@morale.die",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = twilightActor;
  CONFIG.Item.entityClass = twilightItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("twilight2000v4", twilightActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("twilight2000v4", twilightItemSheet, { makeDefault: true });

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

});
