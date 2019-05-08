export const getEvents = eventsJSON => (
    {
      type: 'GET_EVENTS',
      payload: eventsJSON
    }
);

export const showEventItem = selectedEventItem => (
  {
      type: 'SHOW_EVENT_ITEM',
      payload: selectedEventItem
  }
);

export const hideEventItem = () => (
  {
      type: 'HIDE_EVENT_ITEM'
  }
);