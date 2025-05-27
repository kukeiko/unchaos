import { EntityBlueprint } from "@entity-space/common";
import { RecordMetadataDtoBlueprint } from "./record-metadata.dto";

const { entity, readonly } = EntityBlueprint;

export abstract class DatabaseRecordDtoBlueprint {
    metadata = entity(RecordMetadataDtoBlueprint, { readonly });
}
