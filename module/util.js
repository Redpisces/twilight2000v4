export function getItemHiddenFields(item){
  const itemData = item.data;
  const actorData = item.actor ? item.actor.data : {};
  const data = itemData.data;

  if (itemData.type === "weapon") {
    function hideFields(fields) {
      for (let f of fields) {
        data[f].hidden = true;
      }
    }
    switch (data.type.value) {
      case "melee":
        hideFields(["ammo", "rel", "rof", "range", "blast", "mag"])
        break;
      case "bow_thrown":
        hideFields(["ammo", "rel", "rof", "blast", "mag"])
        break;
      case "grenade":
        hideFields(["ammo", "rel", "rof", "mag"])
        break;
      default:

        break;
    }

    return item;
  }
}