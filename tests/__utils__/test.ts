import { StaticTypeCheck } from ".";
import {
  FatherClass,
  FatherInterface,
  SonClass,
  SonInterface,
} from "./common-test-types";

// Test whether the test util works properly.

StaticTypeCheck.assertCompare<FatherInterface, SonInterface>("Superior");
StaticTypeCheck.assertCompare<SonClass, FatherClass>("Inferior");
StaticTypeCheck.assertCompare<SonClass, SonClass>("Equal");
StaticTypeCheck.assertCompare<SonClass, FatherInterface>("Inferior");
StaticTypeCheck.assertCompare<{ a: 1; b: 2 }, { a: 1; c: 3 }>("None");
