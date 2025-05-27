import { EntityBlueprint } from "@entity-space/common";
import { UserDtoBlueprint } from "./user.dto";

const { register, number, entity, string, optional, nullable } = EntityBlueprint;

export class RecordMetadataDtoBlueprint {
    createdAt = string();
    createdById = number();
    createdBy = entity(UserDtoBlueprint, this.createdById, user => user.id, { optional });
    updatedAt = string({ optional, nullable });
    updatedById = number({ optional, nullable });
    updatedBy = entity(UserDtoBlueprint, this.updatedById, user => user.id, { optional, nullable });
}

register(RecordMetadataDtoBlueprint, { name: "record-metadata" });

export type RecordMetadataDto = EntityBlueprint.Instance<RecordMetadataDtoBlueprint>;
