#!/usr/bin/env node
import { textconv } from "../lib";

const [,,filePath] = process.argv;
textconv(filePath);
