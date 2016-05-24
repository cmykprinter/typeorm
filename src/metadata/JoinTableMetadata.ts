import {PropertyMetadata} from "./PropertyMetadata";
import {RelationMetadata} from "./RelationMetadata";
import {ColumnMetadata} from "./ColumnMetadata";
import {JoinTableMetadataArgs} from "./args/JoinTableMetadataArgs";

/**
 */
export class JoinTableMetadata extends PropertyMetadata {

    // ---------------------------------------------------------------------
    // Public Properties
    // ---------------------------------------------------------------------

    /**
     * Relation - owner of this join table metadata.
     */
    relation: RelationMetadata;

    // ---------------------------------------------------------------------
    // Readonly Properties
    // ---------------------------------------------------------------------

    /**
     * Join table name.
     */
    private readonly _name: string;

    /**
     * Join column name.
     */
    private readonly _joinColumnName: string;

    /**
     * Join column referenced column name.
     */
    private readonly _joinColumnReferencedColumnName: string;

    /**
     * Join column name of the inverse side.
     */
    private readonly _inverseJoinColumnName: string;

    /**
     * Join column referenced column name of the inverse side.
     */
    private readonly _inverseJoinColumnReferencedColumnName: string;

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor(metadata: JoinTableMetadataArgs) {
        super(metadata.target, metadata.propertyName);
        
        if (metadata.options.name)
            this._name = metadata.options.name;
        
        if (metadata.options.joinColumn) {
            if (metadata.options.joinColumn.name)
                this._joinColumnName = metadata.options.joinColumn.name;
            if (metadata.options.joinColumn.referencedColumnName)
                this._joinColumnReferencedColumnName = metadata.options.joinColumn.referencedColumnName;
        }
        
        if (metadata.options.inverseJoinColumn) {
            if (metadata.options.inverseJoinColumn.name)
                this._inverseJoinColumnName = metadata.options.inverseJoinColumn.name;
            if (metadata.options.inverseJoinColumn.referencedColumnName)
                this._inverseJoinColumnReferencedColumnName = metadata.options.inverseJoinColumn.referencedColumnName;
        }
    }

    // ---------------------------------------------------------------------
    // Accessors
    // ---------------------------------------------------------------------

    /**
     * Join table name.
     */
    get name() {
        if (this._name)
            return this._name;
        
        return this.relation.entityMetadata.namingStrategy.joinTableName(
            this.relation.entityMetadata.table.name,
            this.relation.inverseEntityMetadata.table.name,
            this.relation.name,
            this.relation.hasInverseSide ? this.relation.inverseRelation.name : "",
            this.referencedColumn.name,
            this.inverseReferencedColumn.name
        );
    }

    /**
     * Join column name.
     */
    get joinColumnName() {
        if (this._joinColumnName)
            return this._joinColumnName;
        
        return this.relation
            .entityMetadata
            .namingStrategy
            .joinTableColumnName(
                this.relation.entityMetadata.table.name, 
                this.referencedColumn.name,
                this.relation.inverseEntityMetadata.table.name, 
                this.inverseReferencedColumn.name
            );
    }

    /**
     * Join column name of the inverse side.
     */
    get inverseJoinColumnName() {
        if (this._inverseJoinColumnName)
            return this._inverseJoinColumnName;
        
        return this.relation
            .entityMetadata
            .namingStrategy
            .joinTableInverseColumnName(
                this.relation.inverseEntityMetadata.table.name,
                this.inverseReferencedColumn.name,
                this.relation.entityMetadata.table.name,
                this.referencedColumn.name
            );
    }

    /**
     * Referenced join column.
     */
    get referencedColumn(): ColumnMetadata {
        if (this._joinColumnReferencedColumnName) {
            const referencedColumn = this.relation.entityMetadata.columns.find(column => column.name === this._joinColumnReferencedColumnName);
            if (!referencedColumn)
                throw new Error(`Referenced column ${this._joinColumnReferencedColumnName} was not found in entity ${this.name}`);
            
            return referencedColumn;
        }

        return this.relation.entityMetadata.primaryColumn;
    }

    /**
     * Referenced join column of the inverse side.
     */
    get inverseReferencedColumn(): ColumnMetadata {
        if (this._inverseJoinColumnReferencedColumnName) {
            const referencedColumn = this.relation.inverseEntityMetadata.columns.find(column => column.name === this._inverseJoinColumnReferencedColumnName);
            if (!referencedColumn)
                throw new Error(`Referenced column ${this._inverseJoinColumnReferencedColumnName} was not found in entity ${this.name}`);

            return referencedColumn;
        }

        return this.relation.inverseEntityMetadata.primaryColumn;
    }

}