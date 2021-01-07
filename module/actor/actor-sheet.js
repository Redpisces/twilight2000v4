/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class twilightActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["twilight2000v4", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */
  /** @override */
  get template() {
    //return unique actor sheet by type, like `weapon-sheet.html`.
    const path = "systems/twilight2000v4/templates/actor";
    return `${path}/${this.actor.data.type}-sheet.html`;
  }
  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];

    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    let terms={};
        
    if (dataset.attribute){
      terms[this.actor.data.data.attributes[dataset.attribute].name]=this.actor.data.data.attributes[dataset.attribute].die;
    }
    if (dataset.skill){
      //search for skills because im a dummy
      for (let attribute of Object.values(this.actor.data.data.attributes)){
        if (attribute.skills[dataset.skill]){
          terms[attribute.skills[dataset.skill].name]=attribute.skills[dataset.skill].die;
        }
      }
      
    }
    let rollproto="{"
    for (let value of Object.values(terms)){
      rollproto+=`1d${value},`
    }
    rollproto=rollproto.slice(0,-1)+"}";
    var roll=new Roll(rollproto);
    roll.evaluate()
    var results=[0,0];
    var content=`<div>Rolls `;
    for (let value of Object.keys(terms)){
      content+=`${value}+`
    }
    content=content.slice(0,-1)+`</div><div>`
    content+=formatTwilightRoll(roll,results);
    content+=`</div><div>Success:${results[0]}. Glitches:${results[1]}</div>`;
    let data={
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content
    };
    ChatMessage.create(data);

  }

}
function formatTwilightRoll(roll,results){
  const colors=["#A00","#0A0","#0AA","#111"];
  let content="";
  for (let dice of roll.terms[0].rolls){
          for (let die of dice.terms){
            let color = ""
            if (die.results[0].result>=10){
              color=colors[2];
              results[0]+=2;
            }
            else if (die.results[0].result>=6){
              color=colors[1];
              results[0]++;
            }
            else if (die.results[0].result==1){
              color=colors[0];
              results[1]++
            }
            else {color=colors[3];}
            
            content+=`<div style="background-image: url('icons/svg/d${die.faces}-grey.svg');position: relative;width: 24px;line-height: 24px;float: left;margin-right: 1px;background-repeat: no-repeat;background-size: 24px 24px;font-size: 16px;color: ${color};font-weight: bold;text-align: center;">${die.results[0].result}</div>`;
          }
  }
  return content;
}
