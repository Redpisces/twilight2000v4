/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class twilightItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
    itemData.type;
    if (itemData.type in ['weapon','gear','armor']){
      if (data.container === undefined) {
        data.container= {'value':'carried'};
      }

      if (data.equipped === undefined) {
        data.equipped = { 'value': false };
      }
    }
  }
}
