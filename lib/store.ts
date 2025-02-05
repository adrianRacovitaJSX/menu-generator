import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MenuItem {
 name: string;
}

export interface MenuStore {
 language: "es" | "ro";
 firstCourses: MenuItem[];
 secondCourses: MenuItem[];
 selectedDate: Date | undefined;
 setLanguage: (lang: "es" | "ro") => void;
 addFirstCourse: () => void;
 addSecondCourse: () => void;
 updateFirstCourse: (index: number, value: string) => void;
 updateSecondCourse: (index: number, value: string) => void;
 removeFirstCourse: (index: number) => void;
 removeSecondCourse: (index: number) => void;
 resetCourses: () => void;
 setSelectedDate: (date: Date | undefined) => void;
}

export const useMenuStore = create<MenuStore>()(
 persist(
   (set) => ({
     language: "es",
     firstCourses: [{ name: "" }],
     secondCourses: [{ name: "" }],
     selectedDate: undefined,
     setLanguage: (lang) => set({ language: lang }),
     setSelectedDate: (date) => set({ selectedDate: date }),
     addFirstCourse: () =>
       set((state) => ({
         firstCourses: [...state.firstCourses, { name: "" }],
       })),
     addSecondCourse: () =>
       set((state) => ({
         secondCourses: [...state.secondCourses, { name: "" }],
       })),
     updateFirstCourse: (index, value) =>
       set((state) => ({
         firstCourses: state.firstCourses.map((course, i) =>
           i === index ? { name: value } : course
         ),
       })),
     updateSecondCourse: (index, value) =>
       set((state) => ({
         secondCourses: state.secondCourses.map((course, i) =>
           i === index ? { name: value } : course
         ),
       })),
     removeFirstCourse: (index) =>
       set((state) => ({
         firstCourses: state.firstCourses.filter((_, i) => i !== index),
       })),
     removeSecondCourse: (index) =>
       set((state) => ({
         secondCourses: state.secondCourses.filter((_, i) => i !== index),
       })),
     resetCourses: () =>
       set({
         firstCourses: [{ name: "" }],
         secondCourses: [{ name: "" }],
         selectedDate: undefined,
       }),
   }),
   {
     name: "menu-storage",
   }
 )
);