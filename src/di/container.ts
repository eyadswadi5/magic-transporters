import { container } from "tsyringe";
import { MoverService } from "../services/MoverService";
import { ItemService } from "../services/ItemService";

container.registerSingleton(MoverService);
container.registerSingleton(ItemService);