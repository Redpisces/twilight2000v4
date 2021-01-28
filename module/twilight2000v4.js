// Import Modules
import { twilightActor } from "./actor/actor.js";
import { twilightActorSheet } from "./actor/actor-sheet.js";
import { twilightItem } from "./item/item.js";
import { twilightItemSheet } from "./item/item-sheet.js";
import { preloadHandlebarsTemplates, registerHandlebars } from './templates.js';
Hooks.once('init', async function () {

  game.twilight2000v4 = {
    twilightActor,
    twilightItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d@cuf.base_die+1d@morale.base_die",
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

  registerHandlebars();
  preloadHandlebarsTemplates();


});
