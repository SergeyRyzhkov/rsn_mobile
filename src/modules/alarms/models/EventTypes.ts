export interface EventType {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const AlarmEventTypeList: EventType[] = [
  {
    id: 1,
    title: "Нападение",
    description: "sdf sdfsdfsdf",
    icon: "/icons/edit.svg",
  },
  {
    id: 2,
    title: "ДТП",
    description: "sdf sdfsdfsdf",
    icon: "/icons/edit.svg",
  },
  {
    id: 3,
    title: "Травма",
    description: "sdf sdfsdfsdf",
    icon: "/icons/edit.svg",
  },
  {
    id: 4,
    title: "Увечие",
    description: "sdf sdfsdfsdf",
    icon: "/icons/edit.svg",
  },
  {
    id: 5,
    title: "Прочее",
    description: "sdf sdfsdfsdf",
    icon: "/icons/edit.svg",
  },
];
