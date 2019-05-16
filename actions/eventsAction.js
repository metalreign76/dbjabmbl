export const getEvents = eventsJSON => (
    {
      type: 'GET_EVENTS',
      payload: eventsJSON
    }
);

export const resetEvents = eventsJSON => (
  {
    type: 'RESET_EVENTS'
  }
);


export const problemWithEvents = eventsJSON => (
  {
    type: 'PROBLEM_EVENTS'
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
