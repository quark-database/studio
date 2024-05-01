export function buildQuery(builder) {
    let builtQuery = "";

    if(builder.instruction === undefined) {
        throw new Error("Query builder format mismatch: instruction field missed.");
    }

    builtQuery += builder.instruction;

    if(builder.general !== undefined) {
        builtQuery += " " + builder.general;
    }

    if(builder.parameters !== undefined) {
        builtQuery += ":"

        for(const [index, parameter] of builder.parameters.entries()) {
            builtQuery += parameter.name + " = " + parameter.value + (index === builder.parameters.length - 1 ? "" : ", ");
        }
    }

    builtQuery += ";"

    return builtQuery;
}