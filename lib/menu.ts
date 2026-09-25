import type { StaticImageData } from "next/image";
import assortedFriedRice from "@/public/images/menu/assorted-fried-rice.jpg";
import assortedJollof from "@/public/images/menu/assorted-jollof.jpg";
import banku from "@/public/images/menu/banku.jpg";
import bankuTilapia from "@/public/images/menu/banku-tilapia.jpg";
import chickenSalad from "@/public/images/menu/chicken-salad.jpg";
import foodBasket from "@/public/images/menu/food-basket.jpg";
import friedRice from "@/public/images/menu/fried-rice.jpg";
import friedRiceChicken from "@/public/images/menu/fried-rice-chicken.jpg";
import jollof from "@/public/images/menu/jollof.jpg";
import jollofGoat from "@/public/images/menu/jollof-goat.jpg";
import jollofRedfish from "@/public/images/menu/jollof-redfish.jpg";
import jollofTurkey from "@/public/images/menu/jollof-turkey.jpg";
import plainRice from "@/public/images/menu/plain-rice.jpg";
import vegetableSalad from "@/public/images/menu/vegetable-salad.jpg";

/**
 * Menu and prices, copied from the official Golden Bite menu flyer (design/menu-flyer.jpeg).
 * Prices are in Ghana cedis. Each price is a portion size the customer can pick.
 *
 * Photos: originals live in design/photos/, `npm run photos` turns them into the graded files in
 * public/images/menu/. A dish without its own photo shows its food family's photo.
 */

export type Photo = { src: StaticImageData; alt: string };

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  prices: number[];
  photo?: Photo;
};

export type MenuFamily = {
  id: string;
  name: string;
  description: string;
  photo: Photo;
  items: MenuItem[];
};

export const menu: MenuFamily[] = [
  {
    id: "jollof",
    name: "Jollof",
    description:
      "Choose your favourite jollof plate, then select the portion that suits your hunger.",
    photo: {
      src: jollof,
      alt: "Jollof rice with grilled chicken, fried plantain and pepper sauce",
    },
    items: [
      {
        id: "jollof-chicken",
        name: "Jollof Rice & Chicken",
        description: "Jollof rice served with chicken.",
        prices: [40, 50, 60, 70, 80, 100],
        photo: { src: jollof, alt: "Jollof rice with grilled chicken and fried plantain" },
      },
      {
        id: "assorted-jollof",
        name: "Assorted Jollof with Chicken",
        description: "Assorted jollof served with chicken.",
        prices: [60, 80, 100, 150, 200],
        photo: { src: assortedJollof, alt: "Jollof rice with pieces of stewed meat" },
      },
      {
        id: "jollof-redfish",
        name: "Jollof & Redfish",
        description: "Jollof rice paired with redfish.",
        prices: [60, 70, 80, 100],
        photo: { src: jollofRedfish, alt: "Jollof rice with fried fish and plantain" },
      },
      {
        id: "jollof-turkey",
        name: "Jollof & Turkey",
        description: "Jollof rice served with peppered turkey.",
        prices: [60, 80, 100],
        photo: { src: jollofTurkey, alt: "Jollof rice with grilled turkey, plantain and salad" },
      },
      {
        id: "jollof-goat",
        name: "Jollof & Goat",
        description: "Jollof rice served with peppered goat.",
        prices: [60, 80, 100],
        photo: { src: jollofGoat, alt: "Jollof rice with peppered goat" },
      },
    ],
  },
  {
    id: "plain-rice",
    name: "Plain Rice",
    description: "Simple, satisfying rice plates with your choice of chicken or fish.",
    photo: { src: plainRice, alt: "White rice with a grilled chicken leg" },
    items: [
      {
        id: "plain-rice-chicken",
        name: "Plain Rice & Chicken",
        description: "Plain rice served with chicken.",
        prices: [30, 40, 50, 60, 80],
      },
      {
        id: "plain-rice-fish",
        name: "Plain Rice & Fish",
        description: "Plain rice served with fish.",
        prices: [50, 60, 80, 100],
      },
    ],
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    description: "Fried-rice favourites, served with chicken, turkey or a generous assortment.",
    photo: { src: friedRice, alt: "Fried rice with vegetables, shrimp and chicken wings" },
    items: [
      {
        id: "fried-rice-chicken",
        name: "Fried Rice & Chicken",
        description: "Fried rice served with chicken.",
        prices: [30, 40, 60, 70, 80, 100],
        photo: { src: friedRiceChicken, alt: "Fried rice with grilled chicken" },
      },
      {
        id: "fried-rice-turkey",
        name: "Fried Rice & Turkey",
        description: "Fried rice served with peppered turkey.",
        prices: [60, 80, 100],
      },
      {
        id: "assorted-fried-rice",
        name: "Assorted Fried Rice with Chicken",
        description: "Assorted fried rice served with chicken.",
        prices: [60, 80, 100, 150, 200],
        photo: { src: assortedFriedRice, alt: "Assorted fried rice with meat and vegetables" },
      },
    ],
  },
  {
    id: "banku-tilapia",
    name: "Banku & Tilapia",
    description: "From a side of banku to tilapia platters, choose exactly what you want.",
    photo: {
      src: bankuTilapia,
      alt: "Grilled tilapia with banku, peppers, onions and two dipping sauces",
    },
    items: [
      {
        id: "tilapia",
        name: "Tilapia",
        description: "Tilapia, prepared to order.",
        prices: [40, 50, 60, 80, 100],
        photo: { src: bankuTilapia, alt: "Grilled tilapia with peppers, onions and banku" },
      },
      {
        id: "tilapia-eggs",
        name: "Tilapia & Fried Eggs",
        description: "Tilapia served with fried eggs.",
        prices: [60, 70, 80, 100],
      },
      {
        id: "banku",
        name: "Banku",
        description: "A side of banku.",
        prices: [5],
        photo: { src: banku, alt: "Banku served with grilled tilapia, peppers and sauces" },
      },
    ],
  },
  {
    id: "salads",
    name: "Salads",
    description: "Vegetable and chicken salads with eggs for a lighter Golden Bite choice.",
    photo: { src: vegetableSalad, alt: "Vegetable salad with boiled eggs" },
    items: [
      {
        id: "vegetable-salad",
        name: "Vegetable Salad with Eggs",
        description: "Vegetable salad served with eggs.",
        prices: [40, 50, 60],
        photo: { src: vegetableSalad, alt: "Vegetable salad with boiled eggs" },
      },
      {
        id: "chicken-salad",
        name: "Chicken Salad with Eggs",
        description: "Chicken salad served with eggs.",
        prices: [50, 60, 70],
        photo: { src: chickenSalad, alt: "Chicken salad with boiled eggs" },
      },
    ],
  },
  {
    id: "food-baskets",
    name: "Food Baskets",
    description: "Food baskets made for sharing with family, friends, colleagues and guests.",
    photo: {
      src: foodBasket,
      alt: "Food basket bowls of fried rice, spring rolls, samosas and egg salad",
    },
    items: [
      {
        id: "food-basket",
        name: "Food Basket",
        description: "A shared food basket for the table.",
        prices: [300, 350, 400, 450, 500, 600],
        photo: {
          src: foodBasket,
          alt: "Food basket bowls of fried rice, spring rolls and samosas",
        },
      },
    ],
  },
];

export const allItems = menu.flatMap((family) => family.items);
