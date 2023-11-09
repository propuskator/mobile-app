
export function patchSubjectArray(draftSubject, patchArray, propertyType) {
    if (!patchArray?.length) return;

    for (const patchProperty of patchArray) {
        if (!draftSubject[propertyType]) draftSubject[propertyType] = [];

        const draftSubjectProperty = draftSubject[propertyType].find(({ id }) => id === patchProperty.id);

        if (draftSubjectProperty) {
            Object.assign(draftSubjectProperty, patchProperty);
        } else {
            draftSubject[propertyType].push(patchProperty);
        }
    }
}

export function patchNodesArray(draftDevice, patchNodes) {
    if (!patchNodes?.length) return;

    for (const patchNode of patchNodes) {
        if (!draftDevice.nodes) draftDevice.nodes = [];

        const draftNode = draftDevice.nodes.find(({ id }) => id === patchNode.id);

        if (draftNode) {
            const {
                sensors   : patchNodeSensors,
                options   : patchNodeOptions,
                telemetry : patchNodeTelemetries,
                ...patchNodeAttributes
            } = patchNode;

            Object.assign(draftNode, patchNodeAttributes);

            patchSubjectArray(draftNode, patchNodeSensors, 'sensors');
            patchSubjectArray(draftNode, patchNodeOptions, 'options');
            patchSubjectArray(draftNode, patchNodeTelemetries, 'telemetry');
        } else {
            draftDevice.nodes.push(patchNode);
        }
    }
}
