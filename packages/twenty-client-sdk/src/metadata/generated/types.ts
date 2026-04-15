export default {
    "scalars": [
        1,
        3,
        4,
        6,
        8,
        11,
        12,
        14,
        15,
        18,
        21,
        22,
        23,
        24,
        35,
        38,
        40,
        51,
        53,
        55,
        58,
        61,
        62,
        63,
        64,
        65,
        67,
        70,
        71,
        76,
        79,
        84,
        88,
        89,
        91,
        95,
        96,
        102,
        118,
        123,
        124,
        125,
        127,
        135,
        150,
        153,
        155,
        159,
        163,
        164,
        170,
        175,
        178,
        182,
        187,
        188,
        190,
        195,
        200,
        201,
        217,
        234,
        251,
        288,
        289,
        299,
        300,
        307,
        336,
        337,
        338,
        339,
        341,
        342,
        343,
        344,
        345,
        346,
        347,
        349,
        351,
        364,
        365,
        366,
        368,
        375,
        382,
        413,
        449,
        507,
        512,
        513
    ],
    "types": {
        "BillingProductDTO": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "images": [
                1
            ],
            "metadata": [
                122
            ],
            "on_BillingLicensedProduct": [
                131
            ],
            "on_BillingMeteredProduct": [
                132
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "ApiKey": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "expiresAt": [
                4
            ],
            "revokedAt": [
                4
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "role": [
                29
            ],
            "__typename": [
                1
            ]
        },
        "UUID": {},
        "DateTime": {},
        "ApplicationRegistrationVariable": {
            "id": [
                3
            ],
            "key": [
                1
            ],
            "description": [
                1
            ],
            "isSecret": [
                6
            ],
            "isRequired": [
                6
            ],
            "isFilled": [
                6
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "Boolean": {},
        "ApplicationRegistration": {
            "id": [
                3
            ],
            "universalIdentifier": [
                1
            ],
            "name": [
                1
            ],
            "oAuthClientId": [
                1
            ],
            "oAuthRedirectUris": [
                1
            ],
            "oAuthScopes": [
                1
            ],
            "ownerWorkspaceId": [
                3
            ],
            "sourceType": [
                8
            ],
            "sourcePackage": [
                1
            ],
            "latestAvailableVersion": [
                1
            ],
            "isListed": [
                6
            ],
            "isFeatured": [
                6
            ],
            "logoUrl": [
                1
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "ApplicationRegistrationSourceType": {},
        "TwoFactorAuthenticationMethodSummary": {
            "twoFactorAuthenticationMethodId": [
                3
            ],
            "status": [
                1
            ],
            "strategy": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "RowLevelPermissionPredicateGroup": {
            "id": [
                1
            ],
            "parentRowLevelPermissionPredicateGroupId": [
                1
            ],
            "logicalOperator": [
                12
            ],
            "positionInRowLevelPermissionPredicateGroup": [
                11
            ],
            "roleId": [
                1
            ],
            "objectMetadataId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Float": {},
        "RowLevelPermissionPredicateGroupLogicalOperator": {},
        "RowLevelPermissionPredicate": {
            "id": [
                1
            ],
            "fieldMetadataId": [
                1
            ],
            "objectMetadataId": [
                1
            ],
            "operand": [
                14
            ],
            "subFieldName": [
                1
            ],
            "workspaceMemberFieldMetadataId": [
                1
            ],
            "workspaceMemberSubFieldName": [
                1
            ],
            "rowLevelPermissionPredicateGroupId": [
                1
            ],
            "positionInRowLevelPermissionPredicateGroup": [
                11
            ],
            "roleId": [
                1
            ],
            "value": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "RowLevelPermissionPredicateOperand": {},
        "JSON": {},
        "ObjectPermission": {
            "objectMetadataId": [
                3
            ],
            "canReadObjectRecords": [
                6
            ],
            "canUpdateObjectRecords": [
                6
            ],
            "canSoftDeleteObjectRecords": [
                6
            ],
            "canDestroyObjectRecords": [
                6
            ],
            "restrictedFields": [
                15
            ],
            "rowLevelPermissionPredicates": [
                13
            ],
            "rowLevelPermissionPredicateGroups": [
                10
            ],
            "__typename": [
                1
            ]
        },
        "UserWorkspace": {
            "id": [
                3
            ],
            "user": [
                69
            ],
            "userId": [
                3
            ],
            "locale": [
                1
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "permissionFlags": [
                18
            ],
            "objectPermissions": [
                16
            ],
            "objectsPermissions": [
                16
            ],
            "twoFactorAuthenticationMethodSummary": [
                9
            ],
            "__typename": [
                1
            ]
        },
        "PermissionFlagType": {},
        "FullName": {
            "firstName": [
                1
            ],
            "lastName": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceMember": {
            "id": [
                3
            ],
            "name": [
                19
            ],
            "userEmail": [
                1
            ],
            "colorScheme": [
                1
            ],
            "avatarUrl": [
                1
            ],
            "locale": [
                1
            ],
            "calendarStartDay": [
                21
            ],
            "timeZone": [
                1
            ],
            "dateFormat": [
                22
            ],
            "timeFormat": [
                23
            ],
            "roles": [
                29
            ],
            "userWorkspaceId": [
                3
            ],
            "numberFormat": [
                24
            ],
            "__typename": [
                1
            ]
        },
        "Int": {},
        "WorkspaceMemberDateFormatEnum": {},
        "WorkspaceMemberTimeFormatEnum": {},
        "WorkspaceMemberNumberFormatEnum": {},
        "Agent": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "description": [
                1
            ],
            "prompt": [
                1
            ],
            "modelId": [
                1
            ],
            "responseFormat": [
                15
            ],
            "roleId": [
                3
            ],
            "isCustom": [
                6
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "modelConfiguration": [
                15
            ],
            "evaluationInputs": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "FieldPermission": {
            "id": [
                3
            ],
            "objectMetadataId": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "roleId": [
                3
            ],
            "canReadFieldValue": [
                6
            ],
            "canUpdateFieldValue": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "PermissionFlag": {
            "id": [
                3
            ],
            "roleId": [
                3
            ],
            "flag": [
                18
            ],
            "__typename": [
                1
            ]
        },
        "ApiKeyForRole": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "expiresAt": [
                4
            ],
            "revokedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "Role": {
            "id": [
                3
            ],
            "universalIdentifier": [
                3
            ],
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "isEditable": [
                6
            ],
            "canBeAssignedToUsers": [
                6
            ],
            "canBeAssignedToAgents": [
                6
            ],
            "canBeAssignedToApiKeys": [
                6
            ],
            "workspaceMembers": [
                20
            ],
            "agents": [
                25
            ],
            "apiKeys": [
                28
            ],
            "canUpdateAllSettings": [
                6
            ],
            "canAccessAllTools": [
                6
            ],
            "canReadAllObjectRecords": [
                6
            ],
            "canUpdateAllObjectRecords": [
                6
            ],
            "canSoftDeleteAllObjectRecords": [
                6
            ],
            "canDestroyAllObjectRecords": [
                6
            ],
            "permissionFlags": [
                27
            ],
            "objectPermissions": [
                16
            ],
            "fieldPermissions": [
                26
            ],
            "rowLevelPermissionPredicates": [
                13
            ],
            "rowLevelPermissionPredicateGroups": [
                10
            ],
            "__typename": [
                1
            ]
        },
        "ApplicationRegistrationSummary": {
            "id": [
                3
            ],
            "latestAvailableVersion": [
                1
            ],
            "sourceType": [
                8
            ],
            "logoUrl": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ApplicationVariable": {
            "id": [
                3
            ],
            "key": [
                1
            ],
            "value": [
                1
            ],
            "description": [
                1
            ],
            "isSecret": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "LogicFunction": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "description": [
                1
            ],
            "runtime": [
                1
            ],
            "timeoutSeconds": [
                11
            ],
            "sourceHandlerPath": [
                1
            ],
            "handlerName": [
                1
            ],
            "toolInputSchema": [
                15
            ],
            "isTool": [
                6
            ],
            "cronTriggerSettings": [
                15
            ],
            "databaseEventTriggerSettings": [
                15
            ],
            "httpRouteTriggerSettings": [
                15
            ],
            "applicationId": [
                3
            ],
            "universalIdentifier": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "StandardOverrides": {
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "translations": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "Field": {
            "id": [
                3
            ],
            "universalIdentifier": [
                1
            ],
            "type": [
                35
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "standardOverrides": [
                33
            ],
            "isCustom": [
                6
            ],
            "isActive": [
                6
            ],
            "isSystem": [
                6
            ],
            "isUIReadOnly": [
                6
            ],
            "isNullable": [
                6
            ],
            "isUnique": [
                6
            ],
            "defaultValue": [
                15
            ],
            "options": [
                15
            ],
            "settings": [
                15
            ],
            "objectMetadataId": [
                3
            ],
            "isLabelSyncedWithName": [
                6
            ],
            "morphId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "applicationId": [
                3
            ],
            "relation": [
                250
            ],
            "morphRelations": [
                250
            ],
            "object": [
                46
            ],
            "__typename": [
                1
            ]
        },
        "FieldMetadataType": {},
        "IndexField": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "order": [
                11
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "Index": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "isCustom": [
                6
            ],
            "isUnique": [
                6
            ],
            "indexWhereClause": [
                1
            ],
            "indexType": [
                38
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "indexFieldMetadataList": [
                36
            ],
            "objectMetadata": [
                243,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        41,
                        "ObjectFilter!"
                    ]
                }
            ],
            "indexFieldMetadatas": [
                241,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        44,
                        "IndexFieldFilter!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "IndexType": {},
        "CursorPaging": {
            "before": [
                40
            ],
            "after": [
                40
            ],
            "first": [
                21
            ],
            "last": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "ConnectionCursor": {},
        "ObjectFilter": {
            "and": [
                41
            ],
            "or": [
                41
            ],
            "id": [
                42
            ],
            "isCustom": [
                43
            ],
            "isRemote": [
                43
            ],
            "isActive": [
                43
            ],
            "isSystem": [
                43
            ],
            "isUIReadOnly": [
                43
            ],
            "isSearchable": [
                43
            ],
            "__typename": [
                1
            ]
        },
        "UUIDFilterComparison": {
            "is": [
                6
            ],
            "isNot": [
                6
            ],
            "eq": [
                3
            ],
            "neq": [
                3
            ],
            "gt": [
                3
            ],
            "gte": [
                3
            ],
            "lt": [
                3
            ],
            "lte": [
                3
            ],
            "like": [
                3
            ],
            "notLike": [
                3
            ],
            "iLike": [
                3
            ],
            "notILike": [
                3
            ],
            "in": [
                3
            ],
            "notIn": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "BooleanFieldComparison": {
            "is": [
                6
            ],
            "isNot": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "IndexFieldFilter": {
            "and": [
                44
            ],
            "or": [
                44
            ],
            "id": [
                42
            ],
            "fieldMetadataId": [
                42
            ],
            "__typename": [
                1
            ]
        },
        "ObjectStandardOverrides": {
            "labelSingular": [
                1
            ],
            "labelPlural": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "color": [
                1
            ],
            "translations": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "Object": {
            "id": [
                3
            ],
            "universalIdentifier": [
                1
            ],
            "nameSingular": [
                1
            ],
            "namePlural": [
                1
            ],
            "labelSingular": [
                1
            ],
            "labelPlural": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "standardOverrides": [
                45
            ],
            "shortcut": [
                1
            ],
            "color": [
                1
            ],
            "isCustom": [
                6
            ],
            "isRemote": [
                6
            ],
            "isActive": [
                6
            ],
            "isSystem": [
                6
            ],
            "isUIReadOnly": [
                6
            ],
            "isSearchable": [
                6
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "labelIdentifierFieldMetadataId": [
                3
            ],
            "imageIdentifierFieldMetadataId": [
                3
            ],
            "isLabelSyncedWithName": [
                6
            ],
            "duplicateCriteria": [
                1
            ],
            "fieldsList": [
                34
            ],
            "indexMetadataList": [
                37
            ],
            "fields": [
                248,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        47,
                        "FieldFilter!"
                    ]
                }
            ],
            "indexMetadatas": [
                246,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        48,
                        "IndexFilter!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "FieldFilter": {
            "and": [
                47
            ],
            "or": [
                47
            ],
            "id": [
                42
            ],
            "isCustom": [
                43
            ],
            "isActive": [
                43
            ],
            "isSystem": [
                43
            ],
            "isUIReadOnly": [
                43
            ],
            "objectMetadataId": [
                42
            ],
            "__typename": [
                1
            ]
        },
        "IndexFilter": {
            "and": [
                48
            ],
            "or": [
                48
            ],
            "id": [
                42
            ],
            "isCustom": [
                43
            ],
            "__typename": [
                1
            ]
        },
        "Application": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "description": [
                1
            ],
            "version": [
                1
            ],
            "universalIdentifier": [
                1
            ],
            "packageJsonChecksum": [
                1
            ],
            "packageJsonFileId": [
                3
            ],
            "yarnLockChecksum": [
                1
            ],
            "yarnLockFileId": [
                3
            ],
            "availablePackages": [
                15
            ],
            "applicationRegistrationId": [
                3
            ],
            "canBeUninstalled": [
                6
            ],
            "defaultRoleId": [
                1
            ],
            "settingsCustomTabFrontComponentId": [
                3
            ],
            "defaultLogicFunctionRole": [
                29
            ],
            "agents": [
                25
            ],
            "logicFunctions": [
                32
            ],
            "objects": [
                46
            ],
            "applicationVariables": [
                31
            ],
            "applicationRegistration": [
                30
            ],
            "__typename": [
                1
            ]
        },
        "ViewField": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "isVisible": [
                6
            ],
            "size": [
                11
            ],
            "position": [
                11
            ],
            "aggregateOperation": [
                51
            ],
            "viewId": [
                3
            ],
            "viewFieldGroupId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "isOverridden": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "AggregateOperations": {},
        "ViewFilterGroup": {
            "id": [
                3
            ],
            "parentViewFilterGroupId": [
                3
            ],
            "logicalOperator": [
                53
            ],
            "positionInViewFilterGroup": [
                11
            ],
            "viewId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "ViewFilterGroupLogicalOperator": {},
        "ViewFilter": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "operand": [
                55
            ],
            "value": [
                15
            ],
            "viewFilterGroupId": [
                3
            ],
            "positionInViewFilterGroup": [
                11
            ],
            "subFieldName": [
                1
            ],
            "viewId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "ViewFilterOperand": {},
        "ViewGroup": {
            "id": [
                3
            ],
            "isVisible": [
                6
            ],
            "fieldValue": [
                1
            ],
            "position": [
                11
            ],
            "viewId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "ViewSort": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "direction": [
                58
            ],
            "viewId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "ViewSortDirection": {},
        "ViewFieldGroup": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "position": [
                11
            ],
            "isVisible": [
                6
            ],
            "viewId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "viewFields": [
                50
            ],
            "isOverridden": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "View": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "objectMetadataId": [
                3
            ],
            "type": [
                61
            ],
            "key": [
                62
            ],
            "icon": [
                1
            ],
            "position": [
                11
            ],
            "isCompact": [
                6
            ],
            "isCustom": [
                6
            ],
            "openRecordIn": [
                63
            ],
            "kanbanAggregateOperation": [
                51
            ],
            "kanbanAggregateOperationFieldMetadataId": [
                3
            ],
            "mainGroupByFieldMetadataId": [
                3
            ],
            "shouldHideEmptyGroups": [
                6
            ],
            "calendarFieldMetadataId": [
                3
            ],
            "workspaceId": [
                3
            ],
            "anyFieldFilterValue": [
                1
            ],
            "calendarLayout": [
                64
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "viewFields": [
                50
            ],
            "viewFilters": [
                54
            ],
            "viewFilterGroups": [
                52
            ],
            "viewSorts": [
                57
            ],
            "viewGroups": [
                56
            ],
            "viewFieldGroups": [
                59
            ],
            "visibility": [
                65
            ],
            "createdByUserWorkspaceId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "ViewType": {},
        "ViewKey": {},
        "ViewOpenRecordIn": {},
        "ViewCalendarLayout": {},
        "ViewVisibility": {},
        "Workspace": {
            "id": [
                3
            ],
            "displayName": [
                1
            ],
            "logo": [
                1
            ],
            "logoFileId": [
                3
            ],
            "inviteHash": [
                1
            ],
            "deletedAt": [
                4
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "allowImpersonation": [
                6
            ],
            "isPublicInviteLinkEnabled": [
                6
            ],
            "trashRetentionDays": [
                11
            ],
            "eventLogRetentionDays": [
                11
            ],
            "workspaceMembersCount": [
                11
            ],
            "activationStatus": [
                67
            ],
            "views": [
                60
            ],
            "viewFields": [
                50
            ],
            "viewFilters": [
                54
            ],
            "viewFilterGroups": [
                52
            ],
            "viewGroups": [
                56
            ],
            "viewSorts": [
                57
            ],
            "metadataVersion": [
                11
            ],
            "databaseSchema": [
                1
            ],
            "subdomain": [
                1
            ],
            "customDomain": [
                1
            ],
            "isGoogleAuthEnabled": [
                6
            ],
            "isGoogleAuthBypassEnabled": [
                6
            ],
            "isTwoFactorAuthenticationEnforced": [
                6
            ],
            "isPasswordAuthEnabled": [
                6
            ],
            "isPasswordAuthBypassEnabled": [
                6
            ],
            "isMicrosoftAuthEnabled": [
                6
            ],
            "isMicrosoftAuthBypassEnabled": [
                6
            ],
            "isCustomDomainEnabled": [
                6
            ],
            "editableProfileFields": [
                1
            ],
            "defaultRole": [
                29
            ],
            "version": [
                1
            ],
            "fastModel": [
                1
            ],
            "smartModel": [
                1
            ],
            "aiAdditionalInstructions": [
                1
            ],
            "enabledAiModelIds": [
                1
            ],
            "useRecommendedModels": [
                6
            ],
            "routerModel": [
                1
            ],
            "workspaceCustomApplication": [
                49
            ],
            "featureFlags": [
                203
            ],
            "billingSubscriptions": [
                134
            ],
            "currentBillingSubscription": [
                134
            ],
            "billingEntitlements": [
                233
            ],
            "hasValidEnterpriseKey": [
                6
            ],
            "hasValidSignedEnterpriseKey": [
                6
            ],
            "hasValidEnterpriseValidityToken": [
                6
            ],
            "workspaceUrls": [
                161
            ],
            "workspaceCustomApplicationId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceActivationStatus": {},
        "AppToken": {
            "id": [
                3
            ],
            "type": [
                1
            ],
            "expiresAt": [
                4
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "User": {
            "id": [
                3
            ],
            "firstName": [
                1
            ],
            "lastName": [
                1
            ],
            "email": [
                1
            ],
            "defaultAvatarUrl": [
                1
            ],
            "isEmailVerified": [
                6
            ],
            "disabled": [
                6
            ],
            "canImpersonate": [
                6
            ],
            "canAccessFullAdminPanel": [
                6
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "locale": [
                1
            ],
            "workspaceMember": [
                20
            ],
            "userWorkspaces": [
                17
            ],
            "onboardingStatus": [
                70
            ],
            "currentWorkspace": [
                66
            ],
            "currentUserWorkspace": [
                17
            ],
            "userVars": [
                71
            ],
            "workspaceMembers": [
                20
            ],
            "deletedWorkspaceMembers": [
                232
            ],
            "hasPassword": [
                6
            ],
            "supportUserHash": [
                1
            ],
            "workspaces": [
                17
            ],
            "availableWorkspaces": [
                231
            ],
            "__typename": [
                1
            ]
        },
        "OnboardingStatus": {},
        "JSONObject": {},
        "RatioAggregateConfig": {
            "fieldMetadataId": [
                3
            ],
            "optionValue": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "RichTextBody": {
            "blocknote": [
                1
            ],
            "markdown": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "GridPosition": {
            "row": [
                11
            ],
            "column": [
                11
            ],
            "rowSpan": [
                11
            ],
            "columnSpan": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "PageLayoutWidget": {
            "id": [
                3
            ],
            "pageLayoutTabId": [
                3
            ],
            "title": [
                1
            ],
            "type": [
                76
            ],
            "objectMetadataId": [
                3
            ],
            "gridPosition": [
                74
            ],
            "position": [
                77
            ],
            "configuration": [
                82
            ],
            "conditionalDisplay": [
                15
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "isOverridden": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "WidgetType": {},
        "PageLayoutWidgetPosition": {
            "on_PageLayoutWidgetGridPosition": [
                78
            ],
            "on_PageLayoutWidgetVerticalListPosition": [
                80
            ],
            "on_PageLayoutWidgetCanvasPosition": [
                81
            ],
            "__typename": [
                1
            ]
        },
        "PageLayoutWidgetGridPosition": {
            "layoutMode": [
                79
            ],
            "row": [
                21
            ],
            "column": [
                21
            ],
            "rowSpan": [
                21
            ],
            "columnSpan": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "PageLayoutTabLayoutMode": {},
        "PageLayoutWidgetVerticalListPosition": {
            "layoutMode": [
                79
            ],
            "index": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "PageLayoutWidgetCanvasPosition": {
            "layoutMode": [
                79
            ],
            "__typename": [
                1
            ]
        },
        "WidgetConfiguration": {
            "on_AggregateChartConfiguration": [
                83
            ],
            "on_CampaignEditorConfiguration": [
                85
            ],
            "on_StandaloneRichTextConfiguration": [
                86
            ],
            "on_PieChartConfiguration": [
                87
            ],
            "on_LineChartConfiguration": [
                90
            ],
            "on_IframeConfiguration": [
                92
            ],
            "on_GaugeChartConfiguration": [
                93
            ],
            "on_BarChartConfiguration": [
                94
            ],
            "on_CalendarConfiguration": [
                97
            ],
            "on_FrontComponentConfiguration": [
                98
            ],
            "on_EmailsConfiguration": [
                99
            ],
            "on_EmailThreadConfiguration": [
                100
            ],
            "on_FieldConfiguration": [
                101
            ],
            "on_FieldRichTextConfiguration": [
                103
            ],
            "on_FieldsConfiguration": [
                104
            ],
            "on_FilesConfiguration": [
                105
            ],
            "on_FormBuilderConfiguration": [
                106
            ],
            "on_LandingPageBuilderConfiguration": [
                107
            ],
            "on_NotesConfiguration": [
                108
            ],
            "on_TasksConfiguration": [
                109
            ],
            "on_TimelineConfiguration": [
                110
            ],
            "on_ViewConfiguration": [
                111
            ],
            "on_RecordTableConfiguration": [
                112
            ],
            "on_WorkflowConfiguration": [
                113
            ],
            "on_WorkflowRunConfiguration": [
                114
            ],
            "on_WorkflowVersionConfiguration": [
                115
            ],
            "__typename": [
                1
            ]
        },
        "AggregateChartConfiguration": {
            "configurationType": [
                84
            ],
            "aggregateFieldMetadataId": [
                3
            ],
            "aggregateOperation": [
                51
            ],
            "label": [
                1
            ],
            "displayDataLabel": [
                6
            ],
            "format": [
                1
            ],
            "description": [
                1
            ],
            "filter": [
                15
            ],
            "timezone": [
                1
            ],
            "firstDayOfTheWeek": [
                21
            ],
            "prefix": [
                1
            ],
            "suffix": [
                1
            ],
            "ratioAggregateConfig": [
                72
            ],
            "__typename": [
                1
            ]
        },
        "WidgetConfigurationType": {},
        "CampaignEditorConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "StandaloneRichTextConfiguration": {
            "configurationType": [
                84
            ],
            "body": [
                73
            ],
            "__typename": [
                1
            ]
        },
        "PieChartConfiguration": {
            "configurationType": [
                84
            ],
            "aggregateFieldMetadataId": [
                3
            ],
            "aggregateOperation": [
                51
            ],
            "groupByFieldMetadataId": [
                3
            ],
            "groupBySubFieldName": [
                1
            ],
            "dateGranularity": [
                88
            ],
            "orderBy": [
                89
            ],
            "manualSortOrder": [
                1
            ],
            "displayDataLabel": [
                6
            ],
            "showCenterMetric": [
                6
            ],
            "displayLegend": [
                6
            ],
            "hideEmptyCategory": [
                6
            ],
            "splitMultiValueFields": [
                6
            ],
            "description": [
                1
            ],
            "color": [
                1
            ],
            "filter": [
                15
            ],
            "timezone": [
                1
            ],
            "firstDayOfTheWeek": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "ObjectRecordGroupByDateGranularity": {},
        "GraphOrderBy": {},
        "LineChartConfiguration": {
            "configurationType": [
                84
            ],
            "aggregateFieldMetadataId": [
                3
            ],
            "aggregateOperation": [
                51
            ],
            "primaryAxisGroupByFieldMetadataId": [
                3
            ],
            "primaryAxisGroupBySubFieldName": [
                1
            ],
            "primaryAxisDateGranularity": [
                88
            ],
            "primaryAxisOrderBy": [
                89
            ],
            "primaryAxisManualSortOrder": [
                1
            ],
            "secondaryAxisGroupByFieldMetadataId": [
                3
            ],
            "secondaryAxisGroupBySubFieldName": [
                1
            ],
            "secondaryAxisGroupByDateGranularity": [
                88
            ],
            "secondaryAxisOrderBy": [
                89
            ],
            "secondaryAxisManualSortOrder": [
                1
            ],
            "omitNullValues": [
                6
            ],
            "splitMultiValueFields": [
                6
            ],
            "axisNameDisplay": [
                91
            ],
            "displayDataLabel": [
                6
            ],
            "displayLegend": [
                6
            ],
            "rangeMin": [
                11
            ],
            "rangeMax": [
                11
            ],
            "description": [
                1
            ],
            "color": [
                1
            ],
            "filter": [
                15
            ],
            "isStacked": [
                6
            ],
            "isCumulative": [
                6
            ],
            "timezone": [
                1
            ],
            "firstDayOfTheWeek": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "AxisNameDisplay": {},
        "IframeConfiguration": {
            "configurationType": [
                84
            ],
            "url": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "GaugeChartConfiguration": {
            "configurationType": [
                84
            ],
            "aggregateFieldMetadataId": [
                3
            ],
            "aggregateOperation": [
                51
            ],
            "displayDataLabel": [
                6
            ],
            "color": [
                1
            ],
            "description": [
                1
            ],
            "filter": [
                15
            ],
            "timezone": [
                1
            ],
            "firstDayOfTheWeek": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "BarChartConfiguration": {
            "configurationType": [
                84
            ],
            "aggregateFieldMetadataId": [
                3
            ],
            "aggregateOperation": [
                51
            ],
            "primaryAxisGroupByFieldMetadataId": [
                3
            ],
            "primaryAxisGroupBySubFieldName": [
                1
            ],
            "primaryAxisDateGranularity": [
                88
            ],
            "primaryAxisOrderBy": [
                89
            ],
            "primaryAxisManualSortOrder": [
                1
            ],
            "secondaryAxisGroupByFieldMetadataId": [
                3
            ],
            "secondaryAxisGroupBySubFieldName": [
                1
            ],
            "secondaryAxisGroupByDateGranularity": [
                88
            ],
            "secondaryAxisOrderBy": [
                89
            ],
            "secondaryAxisManualSortOrder": [
                1
            ],
            "omitNullValues": [
                6
            ],
            "splitMultiValueFields": [
                6
            ],
            "axisNameDisplay": [
                91
            ],
            "displayDataLabel": [
                6
            ],
            "displayLegend": [
                6
            ],
            "rangeMin": [
                11
            ],
            "rangeMax": [
                11
            ],
            "description": [
                1
            ],
            "color": [
                1
            ],
            "filter": [
                15
            ],
            "groupMode": [
                95
            ],
            "layout": [
                96
            ],
            "isCumulative": [
                6
            ],
            "timezone": [
                1
            ],
            "firstDayOfTheWeek": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "BarChartGroupMode": {},
        "BarChartLayout": {},
        "CalendarConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "FrontComponentConfiguration": {
            "configurationType": [
                84
            ],
            "frontComponentId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "EmailsConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "EmailThreadConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "FieldConfiguration": {
            "configurationType": [
                84
            ],
            "fieldMetadataId": [
                1
            ],
            "fieldDisplayMode": [
                102
            ],
            "__typename": [
                1
            ]
        },
        "FieldDisplayMode": {},
        "FieldRichTextConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "FieldsConfiguration": {
            "configurationType": [
                84
            ],
            "viewId": [
                1
            ],
            "newFieldDefaultVisibility": [
                6
            ],
            "shouldAllowUserToSeeHiddenFields": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "FilesConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "FormBuilderConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "LandingPageBuilderConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "NotesConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "TasksConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "TimelineConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "ViewConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "RecordTableConfiguration": {
            "configurationType": [
                84
            ],
            "viewId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkflowConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "WorkflowRunConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "WorkflowVersionConfiguration": {
            "configurationType": [
                84
            ],
            "__typename": [
                1
            ]
        },
        "PageLayoutTab": {
            "id": [
                3
            ],
            "applicationId": [
                3
            ],
            "title": [
                1
            ],
            "position": [
                11
            ],
            "pageLayoutId": [
                3
            ],
            "widgets": [
                75
            ],
            "icon": [
                1
            ],
            "layoutMode": [
                79
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "isOverridden": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "PageLayout": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "type": [
                118
            ],
            "objectMetadataId": [
                3
            ],
            "tabs": [
                116
            ],
            "defaultTabToFocusOnMobileAndSidePanelId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "PageLayoutType": {},
        "Analytics": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "BillingSubscriptionSchedulePhaseItem": {
            "price": [
                1
            ],
            "quantity": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "BillingSubscriptionSchedulePhase": {
            "start_date": [
                11
            ],
            "end_date": [
                11
            ],
            "items": [
                120
            ],
            "__typename": [
                1
            ]
        },
        "BillingProductMetadata": {
            "planKey": [
                123
            ],
            "priceUsageBased": [
                124
            ],
            "productKey": [
                125
            ],
            "__typename": [
                1
            ]
        },
        "BillingPlanKey": {},
        "BillingUsageType": {},
        "BillingProductKey": {},
        "BillingPriceLicensed": {
            "recurringInterval": [
                127
            ],
            "unitAmount": [
                11
            ],
            "stripePriceId": [
                1
            ],
            "priceUsageType": [
                124
            ],
            "__typename": [
                1
            ]
        },
        "SubscriptionInterval": {},
        "BillingPriceTier": {
            "upTo": [
                11
            ],
            "flatAmount": [
                11
            ],
            "unitAmount": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "BillingPriceMetered": {
            "tiers": [
                128
            ],
            "recurringInterval": [
                127
            ],
            "stripePriceId": [
                1
            ],
            "priceUsageType": [
                124
            ],
            "__typename": [
                1
            ]
        },
        "BillingProduct": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "images": [
                1
            ],
            "metadata": [
                122
            ],
            "__typename": [
                1
            ]
        },
        "BillingLicensedProduct": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "images": [
                1
            ],
            "metadata": [
                122
            ],
            "prices": [
                126
            ],
            "__typename": [
                1
            ]
        },
        "BillingMeteredProduct": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "images": [
                1
            ],
            "metadata": [
                122
            ],
            "prices": [
                129
            ],
            "__typename": [
                1
            ]
        },
        "BillingSubscriptionItem": {
            "id": [
                3
            ],
            "hasReachedCurrentPeriodCap": [
                6
            ],
            "quantity": [
                11
            ],
            "stripePriceId": [
                1
            ],
            "billingProduct": [
                0
            ],
            "__typename": [
                1
            ]
        },
        "BillingSubscription": {
            "id": [
                3
            ],
            "status": [
                135
            ],
            "interval": [
                127
            ],
            "billingSubscriptionItems": [
                133
            ],
            "currentPeriodEnd": [
                4
            ],
            "metadata": [
                15
            ],
            "phases": [
                121
            ],
            "__typename": [
                1
            ]
        },
        "SubscriptionStatus": {},
        "BillingEndTrialPeriod": {
            "status": [
                135
            ],
            "hasPaymentMethod": [
                6
            ],
            "billingPortalUrl": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "BillingMeteredProductUsage": {
            "productKey": [
                125
            ],
            "periodStart": [
                4
            ],
            "periodEnd": [
                4
            ],
            "usedCredits": [
                11
            ],
            "grantedCredits": [
                11
            ],
            "rolloverCredits": [
                11
            ],
            "totalGrantedCredits": [
                11
            ],
            "unitPriceCents": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "BillingPlan": {
            "planKey": [
                123
            ],
            "licensedProducts": [
                131
            ],
            "meteredProducts": [
                132
            ],
            "__typename": [
                1
            ]
        },
        "BillingSession": {
            "url": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "BillingUpdate": {
            "currentBillingSubscription": [
                134
            ],
            "billingSubscriptions": [
                134
            ],
            "__typename": [
                1
            ]
        },
        "EnterpriseLicenseInfoDTO": {
            "isValid": [
                6
            ],
            "licensee": [
                1
            ],
            "expiresAt": [
                4
            ],
            "subscriptionId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "EnterpriseSubscriptionStatusDTO": {
            "status": [
                1
            ],
            "licensee": [
                1
            ],
            "expiresAt": [
                4
            ],
            "cancelAt": [
                4
            ],
            "currentPeriodEnd": [
                4
            ],
            "isCancellationScheduled": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "OnboardingStepSuccess": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "ApprovedAccessDomain": {
            "id": [
                3
            ],
            "domain": [
                1
            ],
            "isValidated": [
                6
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "FileWithSignedUrl": {
            "id": [
                3
            ],
            "path": [
                1
            ],
            "size": [
                11
            ],
            "createdAt": [
                4
            ],
            "url": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceInvitation": {
            "id": [
                3
            ],
            "email": [
                1
            ],
            "roleId": [
                3
            ],
            "expiresAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "SendInvitations": {
            "success": [
                6
            ],
            "errors": [
                1
            ],
            "result": [
                146
            ],
            "__typename": [
                1
            ]
        },
        "RecordIdentifier": {
            "id": [
                3
            ],
            "labelIdentifier": [
                1
            ],
            "imageIdentifier": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "NavigationMenuItem": {
            "id": [
                3
            ],
            "userWorkspaceId": [
                3
            ],
            "targetRecordId": [
                3
            ],
            "targetObjectMetadataId": [
                3
            ],
            "viewId": [
                3
            ],
            "type": [
                150
            ],
            "name": [
                1
            ],
            "link": [
                1
            ],
            "icon": [
                1
            ],
            "color": [
                1
            ],
            "folderId": [
                3
            ],
            "position": [
                11
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "targetRecordIdentifier": [
                148
            ],
            "__typename": [
                1
            ]
        },
        "NavigationMenuItemType": {},
        "ObjectRecordEventProperties": {
            "updatedFields": [
                1
            ],
            "before": [
                15
            ],
            "after": [
                15
            ],
            "diff": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "MetadataEvent": {
            "type": [
                153
            ],
            "metadataName": [
                1
            ],
            "recordId": [
                1
            ],
            "properties": [
                151
            ],
            "updatedCollectionHash": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "MetadataEventAction": {},
        "ObjectRecordEvent": {
            "action": [
                155
            ],
            "objectNameSingular": [
                1
            ],
            "recordId": [
                1
            ],
            "userId": [
                1
            ],
            "workspaceMemberId": [
                1
            ],
            "properties": [
                151
            ],
            "__typename": [
                1
            ]
        },
        "DatabaseEventAction": {},
        "ObjectRecordEventWithQueryIds": {
            "queryIds": [
                1
            ],
            "objectRecordEvent": [
                154
            ],
            "__typename": [
                1
            ]
        },
        "EventSubscription": {
            "eventStreamId": [
                1
            ],
            "objectRecordEventsWithQueryIds": [
                156
            ],
            "metadataEvents": [
                152
            ],
            "__typename": [
                1
            ]
        },
        "LogicFunctionExecutionResult": {
            "data": [
                15
            ],
            "logs": [
                1
            ],
            "duration": [
                11
            ],
            "status": [
                159
            ],
            "error": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "LogicFunctionExecutionStatus": {},
        "BillingTrialPeriod": {
            "duration": [
                11
            ],
            "isCreditCardRequired": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceUrls": {
            "customUrl": [
                1
            ],
            "subdomainUrl": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "SSOIdentityProvider": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "type": [
                163
            ],
            "status": [
                164
            ],
            "issuer": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "IdentityProviderType": {},
        "SSOIdentityProviderStatus": {},
        "AuthProviders": {
            "sso": [
                162
            ],
            "google": [
                6
            ],
            "magicLink": [
                6
            ],
            "password": [
                6
            ],
            "microsoft": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "AuthBypassProviders": {
            "google": [
                6
            ],
            "password": [
                6
            ],
            "microsoft": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "PublicWorkspaceData": {
            "id": [
                3
            ],
            "authProviders": [
                165
            ],
            "authBypassProviders": [
                166
            ],
            "logo": [
                1
            ],
            "displayName": [
                1
            ],
            "workspaceUrls": [
                161
            ],
            "__typename": [
                1
            ]
        },
        "NativeModelCapabilities": {
            "webSearch": [
                6
            ],
            "twitterSearch": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "ClientAIModelConfig": {
            "modelId": [
                1
            ],
            "label": [
                1
            ],
            "modelFamily": [
                170
            ],
            "modelFamilyLabel": [
                1
            ],
            "sdkPackage": [
                1
            ],
            "inputCostPerMillionTokensInCredits": [
                11
            ],
            "outputCostPerMillionTokensInCredits": [
                11
            ],
            "nativeCapabilities": [
                168
            ],
            "isDeprecated": [
                6
            ],
            "isRecommended": [
                6
            ],
            "providerName": [
                1
            ],
            "dataResidency": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ModelFamily": {},
        "AdminAIModelConfig": {
            "modelId": [
                1
            ],
            "label": [
                1
            ],
            "modelFamily": [
                170
            ],
            "modelFamilyLabel": [
                1
            ],
            "sdkPackage": [
                1
            ],
            "isAvailable": [
                6
            ],
            "isAdminEnabled": [
                6
            ],
            "isDeprecated": [
                6
            ],
            "isRecommended": [
                6
            ],
            "contextWindowTokens": [
                11
            ],
            "maxOutputTokens": [
                11
            ],
            "inputCostPerMillionTokens": [
                11
            ],
            "outputCostPerMillionTokens": [
                11
            ],
            "providerName": [
                1
            ],
            "providerLabel": [
                1
            ],
            "name": [
                1
            ],
            "dataResidency": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "AdminAIModels": {
            "models": [
                171
            ],
            "defaultSmartModelId": [
                1
            ],
            "defaultFastModelId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Billing": {
            "isBillingEnabled": [
                6
            ],
            "billingUrl": [
                1
            ],
            "trialPeriods": [
                160
            ],
            "__typename": [
                1
            ]
        },
        "Support": {
            "supportDriver": [
                175
            ],
            "supportFrontChatId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "SupportDriver": {},
        "Sentry": {
            "environment": [
                1
            ],
            "release": [
                1
            ],
            "dsn": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Captcha": {
            "provider": [
                178
            ],
            "siteKey": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CaptchaDriverType": {},
        "ApiConfig": {
            "mutationMaximumAffectedRecords": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "PublicFeatureFlagMetadata": {
            "label": [
                1
            ],
            "description": [
                1
            ],
            "imagePath": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "PublicFeatureFlag": {
            "key": [
                182
            ],
            "metadata": [
                180
            ],
            "__typename": [
                1
            ]
        },
        "FeatureFlagKey": {},
        "ClientConfigMaintenanceMode": {
            "startAt": [
                4
            ],
            "endAt": [
                4
            ],
            "link": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ClientConfig": {
            "appVersion": [
                1
            ],
            "authProviders": [
                165
            ],
            "billing": [
                173
            ],
            "aiModels": [
                169
            ],
            "signInPrefilled": [
                6
            ],
            "isMultiWorkspaceEnabled": [
                6
            ],
            "isEmailVerificationRequired": [
                6
            ],
            "defaultSubdomain": [
                1
            ],
            "frontDomain": [
                1
            ],
            "analyticsEnabled": [
                6
            ],
            "support": [
                174
            ],
            "isAttachmentPreviewEnabled": [
                6
            ],
            "sentry": [
                176
            ],
            "captcha": [
                177
            ],
            "api": [
                179
            ],
            "canManageFeatureFlags": [
                6
            ],
            "publicFeatureFlags": [
                181
            ],
            "isMicrosoftMessagingEnabled": [
                6
            ],
            "isMicrosoftCalendarEnabled": [
                6
            ],
            "isGoogleMessagingEnabled": [
                6
            ],
            "isGoogleCalendarEnabled": [
                6
            ],
            "isConfigVariablesInDbEnabled": [
                6
            ],
            "isImapSmtpCaldavEnabled": [
                6
            ],
            "allowRequestsToTwentyIcons": [
                6
            ],
            "calendarBookingPageId": [
                1
            ],
            "isCloudflareIntegrationEnabled": [
                6
            ],
            "isClickHouseConfigured": [
                6
            ],
            "isWorkspaceSchemaDDLLocked": [
                6
            ],
            "maintenance": [
                183
            ],
            "__typename": [
                1
            ]
        },
        "UsageBreakdownItem": {
            "key": [
                1
            ],
            "label": [
                1
            ],
            "creditsUsed": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "ConfigVariable": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "value": [
                15
            ],
            "isSensitive": [
                6
            ],
            "source": [
                187
            ],
            "isEnvOnly": [
                6
            ],
            "type": [
                188
            ],
            "options": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "ConfigSource": {},
        "ConfigVariableType": {},
        "ConfigVariablesGroupData": {
            "variables": [
                186
            ],
            "name": [
                190
            ],
            "description": [
                1
            ],
            "isHiddenOnLoad": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "ConfigVariablesGroup": {},
        "ConfigVariables": {
            "groups": [
                189
            ],
            "__typename": [
                1
            ]
        },
        "JobOperationResult": {
            "jobId": [
                1
            ],
            "success": [
                6
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DeleteJobsResponse": {
            "deletedCount": [
                21
            ],
            "results": [
                192
            ],
            "__typename": [
                1
            ]
        },
        "QueueJob": {
            "id": [
                1
            ],
            "name": [
                1
            ],
            "data": [
                15
            ],
            "state": [
                195
            ],
            "timestamp": [
                11
            ],
            "failedReason": [
                1
            ],
            "processedOn": [
                11
            ],
            "finishedOn": [
                11
            ],
            "attemptsMade": [
                11
            ],
            "returnValue": [
                15
            ],
            "logs": [
                1
            ],
            "stackTrace": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "JobState": {},
        "QueueRetentionConfig": {
            "completedMaxAge": [
                11
            ],
            "completedMaxCount": [
                11
            ],
            "failedMaxAge": [
                11
            ],
            "failedMaxCount": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "QueueJobsResponse": {
            "jobs": [
                194
            ],
            "count": [
                11
            ],
            "totalCount": [
                11
            ],
            "hasMore": [
                6
            ],
            "retentionConfig": [
                196
            ],
            "__typename": [
                1
            ]
        },
        "RetryJobsResponse": {
            "retriedCount": [
                21
            ],
            "results": [
                192
            ],
            "__typename": [
                1
            ]
        },
        "SystemHealthService": {
            "id": [
                200
            ],
            "label": [
                1
            ],
            "status": [
                201
            ],
            "__typename": [
                1
            ]
        },
        "HealthIndicatorId": {},
        "AdminPanelHealthServiceStatus": {},
        "SystemHealth": {
            "services": [
                199
            ],
            "__typename": [
                1
            ]
        },
        "FeatureFlag": {
            "key": [
                182
            ],
            "value": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UserInfo": {
            "id": [
                3
            ],
            "email": [
                1
            ],
            "firstName": [
                1
            ],
            "lastName": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceInfo": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "allowImpersonation": [
                6
            ],
            "logo": [
                1
            ],
            "totalUsers": [
                11
            ],
            "workspaceUrls": [
                161
            ],
            "users": [
                204
            ],
            "featureFlags": [
                203
            ],
            "__typename": [
                1
            ]
        },
        "UserLookup": {
            "user": [
                204
            ],
            "workspaces": [
                205
            ],
            "__typename": [
                1
            ]
        },
        "VersionInfo": {
            "currentVersion": [
                1
            ],
            "latestVersion": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "AdminPanelWorkerQueueHealth": {
            "id": [
                1
            ],
            "queueName": [
                1
            ],
            "status": [
                201
            ],
            "__typename": [
                1
            ]
        },
        "AdminPanelHealthServiceData": {
            "id": [
                200
            ],
            "label": [
                1
            ],
            "description": [
                1
            ],
            "status": [
                201
            ],
            "errorMessage": [
                1
            ],
            "details": [
                1
            ],
            "queues": [
                208
            ],
            "__typename": [
                1
            ]
        },
        "MaintenanceMode": {
            "startAt": [
                4
            ],
            "endAt": [
                4
            ],
            "link": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ModelsDevModelSuggestion": {
            "modelId": [
                1
            ],
            "name": [
                1
            ],
            "inputCostPerMillionTokens": [
                11
            ],
            "outputCostPerMillionTokens": [
                11
            ],
            "cachedInputCostPerMillionTokens": [
                11
            ],
            "cacheCreationCostPerMillionTokens": [
                11
            ],
            "contextWindowTokens": [
                11
            ],
            "maxOutputTokens": [
                11
            ],
            "modalities": [
                1
            ],
            "supportsReasoning": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "ModelsDevProviderSuggestion": {
            "id": [
                1
            ],
            "modelCount": [
                11
            ],
            "npm": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "QueueMetricsDataPoint": {
            "x": [
                11
            ],
            "y": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "QueueMetricsSeries": {
            "id": [
                1
            ],
            "data": [
                213
            ],
            "__typename": [
                1
            ]
        },
        "WorkerQueueMetrics": {
            "failed": [
                11
            ],
            "completed": [
                11
            ],
            "waiting": [
                11
            ],
            "active": [
                11
            ],
            "delayed": [
                11
            ],
            "failureRate": [
                11
            ],
            "failedData": [
                11
            ],
            "completedData": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "QueueMetricsData": {
            "queueName": [
                1
            ],
            "workers": [
                11
            ],
            "timeRange": [
                217
            ],
            "details": [
                215
            ],
            "data": [
                214
            ],
            "__typename": [
                1
            ]
        },
        "QueueMetricsTimeRange": {},
        "VersionDistributionEntry": {
            "version": [
                1
            ],
            "count": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "ApplicationRegistrationStats": {
            "activeInstalls": [
                21
            ],
            "mostInstalledVersion": [
                1
            ],
            "versionDistribution": [
                218
            ],
            "__typename": [
                1
            ]
        },
        "CreateApplicationRegistration": {
            "applicationRegistration": [
                7
            ],
            "clientSecret": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "PublicApplicationRegistration": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "logoUrl": [
                1
            ],
            "websiteUrl": [
                1
            ],
            "oAuthScopes": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "RotateClientSecret": {
            "clientSecret": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ResendEmailVerificationToken": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "DeleteSso": {
            "identityProviderId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "EditSso": {
            "id": [
                3
            ],
            "type": [
                163
            ],
            "issuer": [
                1
            ],
            "name": [
                1
            ],
            "status": [
                164
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceNameAndId": {
            "displayName": [
                1
            ],
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "FindAvailableSSOIDP": {
            "type": [
                163
            ],
            "id": [
                3
            ],
            "issuer": [
                1
            ],
            "name": [
                1
            ],
            "status": [
                164
            ],
            "workspace": [
                226
            ],
            "__typename": [
                1
            ]
        },
        "SetupSso": {
            "id": [
                3
            ],
            "type": [
                163
            ],
            "issuer": [
                1
            ],
            "name": [
                1
            ],
            "status": [
                164
            ],
            "__typename": [
                1
            ]
        },
        "SSOConnection": {
            "type": [
                163
            ],
            "id": [
                3
            ],
            "issuer": [
                1
            ],
            "name": [
                1
            ],
            "status": [
                164
            ],
            "__typename": [
                1
            ]
        },
        "AvailableWorkspace": {
            "id": [
                3
            ],
            "displayName": [
                1
            ],
            "loginToken": [
                1
            ],
            "personalInviteToken": [
                1
            ],
            "inviteHash": [
                1
            ],
            "workspaceUrls": [
                161
            ],
            "logo": [
                1
            ],
            "sso": [
                229
            ],
            "__typename": [
                1
            ]
        },
        "AvailableWorkspaces": {
            "availableWorkspacesForSignIn": [
                230
            ],
            "availableWorkspacesForSignUp": [
                230
            ],
            "__typename": [
                1
            ]
        },
        "DeletedWorkspaceMember": {
            "id": [
                3
            ],
            "name": [
                19
            ],
            "userEmail": [
                1
            ],
            "avatarUrl": [
                1
            ],
            "userWorkspaceId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "BillingEntitlement": {
            "key": [
                234
            ],
            "value": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "BillingEntitlementKey": {},
        "DomainRecord": {
            "validationType": [
                1
            ],
            "type": [
                1
            ],
            "status": [
                1
            ],
            "key": [
                1
            ],
            "value": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DomainValidRecords": {
            "id": [
                3
            ],
            "domain": [
                1
            ],
            "records": [
                235
            ],
            "__typename": [
                1
            ]
        },
        "IndexEdge": {
            "node": [
                37
            ],
            "cursor": [
                40
            ],
            "__typename": [
                1
            ]
        },
        "PageInfo": {
            "hasNextPage": [
                6
            ],
            "hasPreviousPage": [
                6
            ],
            "startCursor": [
                40
            ],
            "endCursor": [
                40
            ],
            "__typename": [
                1
            ]
        },
        "IndexConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                237
            ],
            "__typename": [
                1
            ]
        },
        "IndexFieldEdge": {
            "node": [
                36
            ],
            "cursor": [
                40
            ],
            "__typename": [
                1
            ]
        },
        "IndexIndexFieldMetadatasConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                240
            ],
            "__typename": [
                1
            ]
        },
        "ObjectEdge": {
            "node": [
                46
            ],
            "cursor": [
                40
            ],
            "__typename": [
                1
            ]
        },
        "IndexObjectMetadataConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                242
            ],
            "__typename": [
                1
            ]
        },
        "ObjectRecordCount": {
            "objectNamePlural": [
                1
            ],
            "totalCount": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "ObjectConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                242
            ],
            "__typename": [
                1
            ]
        },
        "ObjectIndexMetadatasConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                237
            ],
            "__typename": [
                1
            ]
        },
        "FieldEdge": {
            "node": [
                34
            ],
            "cursor": [
                40
            ],
            "__typename": [
                1
            ]
        },
        "ObjectFieldsConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                247
            ],
            "__typename": [
                1
            ]
        },
        "UpsertRowLevelPermissionPredicatesResult": {
            "predicates": [
                13
            ],
            "predicateGroups": [
                10
            ],
            "__typename": [
                1
            ]
        },
        "Relation": {
            "type": [
                251
            ],
            "sourceObjectMetadata": [
                46
            ],
            "targetObjectMetadata": [
                46
            ],
            "sourceFieldMetadata": [
                34
            ],
            "targetFieldMetadata": [
                34
            ],
            "__typename": [
                1
            ]
        },
        "RelationType": {},
        "FieldConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                247
            ],
            "__typename": [
                1
            ]
        },
        "AuthToken": {
            "token": [
                1
            ],
            "expiresAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "ApplicationTokenPair": {
            "applicationAccessToken": [
                253
            ],
            "applicationRefreshToken": [
                253
            ],
            "__typename": [
                1
            ]
        },
        "FrontComponent": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "description": [
                1
            ],
            "sourceComponentPath": [
                1
            ],
            "builtComponentPath": [
                1
            ],
            "componentName": [
                1
            ],
            "builtComponentChecksum": [
                1
            ],
            "universalIdentifier": [
                3
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "isHeadless": [
                6
            ],
            "usesSdkClient": [
                6
            ],
            "applicationTokenPair": [
                254
            ],
            "__typename": [
                1
            ]
        },
        "LogicFunctionLogs": {
            "logs": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DeleteTwoFactorAuthenticationMethod": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "InitiateTwoFactorAuthenticationProvisioning": {
            "uri": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "VerifyTwoFactorAuthenticationMethod": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "AuthorizeApp": {
            "redirectUrl": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "AuthTokenPair": {
            "accessOrWorkspaceAgnosticToken": [
                253
            ],
            "refreshToken": [
                253
            ],
            "__typename": [
                1
            ]
        },
        "AvailableWorkspacesAndAccessTokens": {
            "tokens": [
                261
            ],
            "availableWorkspaces": [
                231
            ],
            "__typename": [
                1
            ]
        },
        "EmailPasswordResetLink": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "GetAuthorizationUrlForSSO": {
            "authorizationURL": [
                1
            ],
            "type": [
                1
            ],
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "InvalidatePassword": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceUrlsAndId": {
            "workspaceUrls": [
                161
            ],
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "SignUp": {
            "loginToken": [
                253
            ],
            "workspace": [
                266
            ],
            "__typename": [
                1
            ]
        },
        "TransientToken": {
            "transientToken": [
                253
            ],
            "__typename": [
                1
            ]
        },
        "ValidatePasswordResetToken": {
            "id": [
                3
            ],
            "email": [
                1
            ],
            "hasPassword": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "VerifyEmailAndGetLoginToken": {
            "loginToken": [
                253
            ],
            "workspaceUrls": [
                161
            ],
            "__typename": [
                1
            ]
        },
        "ApiKeyToken": {
            "token": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "AuthTokens": {
            "tokens": [
                261
            ],
            "__typename": [
                1
            ]
        },
        "LoginToken": {
            "loginToken": [
                253
            ],
            "__typename": [
                1
            ]
        },
        "CheckUserExist": {
            "exists": [
                6
            ],
            "availableWorkspacesCount": [
                11
            ],
            "isEmailVerified": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceInviteHashValid": {
            "isValid": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "Impersonate": {
            "loginToken": [
                253
            ],
            "workspace": [
                266
            ],
            "__typename": [
                1
            ]
        },
        "UsageTimeSeries": {
            "date": [
                1
            ],
            "creditsUsed": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "UsageUserDaily": {
            "userWorkspaceId": [
                1
            ],
            "dailyUsage": [
                277
            ],
            "__typename": [
                1
            ]
        },
        "UsageAnalytics": {
            "usageByUser": [
                185
            ],
            "usageByOperationType": [
                185
            ],
            "usageByModel": [
                185
            ],
            "timeSeries": [
                277
            ],
            "periodStart": [
                4
            ],
            "periodEnd": [
                4
            ],
            "userDailyUsage": [
                278
            ],
            "__typename": [
                1
            ]
        },
        "DevelopmentApplication": {
            "id": [
                1
            ],
            "universalIdentifier": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceMigration": {
            "applicationUniversalIdentifier": [
                1
            ],
            "actions": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "File": {
            "id": [
                3
            ],
            "path": [
                1
            ],
            "size": [
                11
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "MarketplaceApp": {
            "id": [
                1
            ],
            "name": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "author": [
                1
            ],
            "category": [
                1
            ],
            "logo": [
                1
            ],
            "sourcePackage": [
                1
            ],
            "isFeatured": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "MarketplaceAppDetail": {
            "universalIdentifier": [
                1
            ],
            "id": [
                1
            ],
            "name": [
                1
            ],
            "sourceType": [
                8
            ],
            "sourcePackage": [
                1
            ],
            "latestAvailableVersion": [
                1
            ],
            "isListed": [
                6
            ],
            "isFeatured": [
                6
            ],
            "manifest": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "PublicDomain": {
            "id": [
                3
            ],
            "domain": [
                1
            ],
            "isValidated": [
                6
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "VerificationRecord": {
            "type": [
                1
            ],
            "key": [
                1
            ],
            "value": [
                1
            ],
            "priority": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "EmailingDomain": {
            "id": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "domain": [
                1
            ],
            "driver": [
                288
            ],
            "status": [
                289
            ],
            "verificationRecords": [
                286
            ],
            "verifiedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "EmailingDomainDriver": {},
        "EmailingDomainStatus": {},
        "AutocompleteResult": {
            "text": [
                1
            ],
            "placeId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Location": {
            "lat": [
                11
            ],
            "lng": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "PlaceDetailsResult": {
            "state": [
                1
            ],
            "postcode": [
                1
            ],
            "city": [
                1
            ],
            "country": [
                1
            ],
            "location": [
                291
            ],
            "__typename": [
                1
            ]
        },
        "ConnectionParametersOutput": {
            "host": [
                1
            ],
            "port": [
                11
            ],
            "username": [
                1
            ],
            "password": [
                1
            ],
            "secure": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "ImapSmtpCaldavConnectionParameters": {
            "IMAP": [
                293
            ],
            "SMTP": [
                293
            ],
            "CALDAV": [
                293
            ],
            "__typename": [
                1
            ]
        },
        "ConnectedImapSmtpCaldavAccount": {
            "id": [
                3
            ],
            "handle": [
                1
            ],
            "provider": [
                1
            ],
            "userWorkspaceId": [
                3
            ],
            "connectionParameters": [
                294
            ],
            "__typename": [
                1
            ]
        },
        "ImapSmtpCaldavConnectionSuccess": {
            "success": [
                6
            ],
            "connectedAccountId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "PostgresCredentials": {
            "id": [
                3
            ],
            "user": [
                1
            ],
            "password": [
                1
            ],
            "workspaceId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "CommandMenuItem": {
            "id": [
                3
            ],
            "workflowVersionId": [
                3
            ],
            "frontComponentId": [
                3
            ],
            "frontComponent": [
                255
            ],
            "engineComponentKey": [
                299
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "shortLabel": [
                1
            ],
            "position": [
                11
            ],
            "isPinned": [
                6
            ],
            "availabilityType": [
                300
            ],
            "hotKeys": [
                1
            ],
            "conditionalAvailabilityExpression": [
                1
            ],
            "availabilityObjectMetadataId": [
                3
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "EngineComponentKey": {},
        "CommandMenuItemAvailabilityType": {},
        "ToolIndexEntry": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "category": [
                1
            ],
            "objectName": [
                1
            ],
            "icon": [
                1
            ],
            "inputSchema": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "AgentMessagePart": {
            "id": [
                3
            ],
            "messageId": [
                3
            ],
            "orderIndex": [
                21
            ],
            "type": [
                1
            ],
            "textContent": [
                1
            ],
            "reasoningContent": [
                1
            ],
            "toolName": [
                1
            ],
            "toolCallId": [
                1
            ],
            "toolInput": [
                15
            ],
            "toolOutput": [
                15
            ],
            "state": [
                1
            ],
            "errorMessage": [
                1
            ],
            "errorDetails": [
                15
            ],
            "sourceUrlSourceId": [
                1
            ],
            "sourceUrlUrl": [
                1
            ],
            "sourceUrlTitle": [
                1
            ],
            "sourceDocumentSourceId": [
                1
            ],
            "sourceDocumentMediaType": [
                1
            ],
            "sourceDocumentTitle": [
                1
            ],
            "sourceDocumentFilename": [
                1
            ],
            "fileMediaType": [
                1
            ],
            "fileFilename": [
                1
            ],
            "fileId": [
                3
            ],
            "fileUrl": [
                1
            ],
            "providerMetadata": [
                15
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "CampaignActionOutput": {
            "success": [
                6
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ResolveRecipientsOutput": {
            "success": [
                6
            ],
            "created": [
                21
            ],
            "skipped": [
                21
            ],
            "total": [
                21
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DripCampaignActionOutputDTO": {
            "success": [
                6
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateDripCampaignOutputDTO": {
            "success": [
                6
            ],
            "dripCampaignId": [
                307
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ID": {},
        "EnrollContactsOutputDTO": {
            "success": [
                6
            ],
            "enrolled": [
                21
            ],
            "skipped": [
                21
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ChannelSyncSuccess": {
            "success": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "BarChartSeries": {
            "key": [
                1
            ],
            "label": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "BarChartData": {
            "data": [
                15
            ],
            "indexBy": [
                1
            ],
            "keys": [
                1
            ],
            "series": [
                310
            ],
            "xAxisLabel": [
                1
            ],
            "yAxisLabel": [
                1
            ],
            "showLegend": [
                6
            ],
            "showDataLabels": [
                6
            ],
            "layout": [
                96
            ],
            "groupMode": [
                95
            ],
            "hasTooManyGroups": [
                6
            ],
            "formattedToRawLookup": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "LineChartDataPoint": {
            "x": [
                1
            ],
            "y": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "LineChartSeries": {
            "id": [
                1
            ],
            "label": [
                1
            ],
            "data": [
                312
            ],
            "__typename": [
                1
            ]
        },
        "LineChartData": {
            "series": [
                313
            ],
            "xAxisLabel": [
                1
            ],
            "yAxisLabel": [
                1
            ],
            "showLegend": [
                6
            ],
            "showDataLabels": [
                6
            ],
            "hasTooManyGroups": [
                6
            ],
            "formattedToRawLookup": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "PieChartDataItem": {
            "id": [
                1
            ],
            "value": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "PieChartData": {
            "data": [
                315
            ],
            "showLegend": [
                6
            ],
            "showDataLabels": [
                6
            ],
            "showCenterMetric": [
                6
            ],
            "hasTooManyGroups": [
                6
            ],
            "formattedToRawLookup": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "DuplicatedDashboard": {
            "id": [
                3
            ],
            "title": [
                1
            ],
            "pageLayoutId": [
                3
            ],
            "position": [
                11
            ],
            "createdAt": [
                1
            ],
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ConnectedAccountDTO": {
            "id": [
                3
            ],
            "handle": [
                1
            ],
            "provider": [
                1
            ],
            "lastCredentialsRefreshedAt": [
                4
            ],
            "authFailedAt": [
                4
            ],
            "handleAliases": [
                1
            ],
            "scopes": [
                1
            ],
            "connectionParameters": [
                294
            ],
            "lastSignedInAt": [
                4
            ],
            "userWorkspaceId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "SendEmailOutput": {
            "success": [
                6
            ],
            "error": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "EventLogRecord": {
            "event": [
                1
            ],
            "timestamp": [
                4
            ],
            "userId": [
                1
            ],
            "properties": [
                15
            ],
            "recordId": [
                1
            ],
            "objectMetadataId": [
                1
            ],
            "isCustom": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "EventLogPageInfo": {
            "endCursor": [
                1
            ],
            "hasNextPage": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "EventLogQueryResult": {
            "records": [
                320
            ],
            "totalCount": [
                21
            ],
            "pageInfo": [
                321
            ],
            "__typename": [
                1
            ]
        },
        "Skill": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "description": [
                1
            ],
            "content": [
                1
            ],
            "isCustom": [
                6
            ],
            "isActive": [
                6
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatThread": {
            "id": [
                3
            ],
            "title": [
                1
            ],
            "totalInputTokens": [
                21
            ],
            "totalOutputTokens": [
                21
            ],
            "contextWindowTokens": [
                21
            ],
            "conversationSize": [
                21
            ],
            "totalInputCredits": [
                11
            ],
            "totalOutputCredits": [
                11
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "AgentMessage": {
            "id": [
                3
            ],
            "threadId": [
                3
            ],
            "turnId": [
                3
            ],
            "agentId": [
                3
            ],
            "role": [
                1
            ],
            "status": [
                1
            ],
            "parts": [
                302
            ],
            "processedAt": [
                4
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "AISystemPromptSection": {
            "title": [
                1
            ],
            "content": [
                1
            ],
            "estimatedTokenCount": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "AISystemPromptPreview": {
            "sections": [
                326
            ],
            "estimatedTokenCount": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "ChatStreamCatchupChunks": {
            "chunks": [
                15
            ],
            "maxSeq": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "SendChatMessageResult": {
            "messageId": [
                1
            ],
            "queued": [
                6
            ],
            "streamId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatEvent": {
            "threadId": [
                1
            ],
            "event": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatThreadEdge": {
            "node": [
                324
            ],
            "cursor": [
                40
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatThreadConnection": {
            "pageInfo": [
                238
            ],
            "edges": [
                331
            ],
            "__typename": [
                1
            ]
        },
        "AgentTurnEvaluation": {
            "id": [
                3
            ],
            "turnId": [
                3
            ],
            "score": [
                21
            ],
            "comment": [
                1
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "AgentTurn": {
            "id": [
                3
            ],
            "threadId": [
                3
            ],
            "agentId": [
                3
            ],
            "evaluations": [
                333
            ],
            "messages": [
                325
            ],
            "createdAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "CalendarChannel": {
            "id": [
                3
            ],
            "handle": [
                1
            ],
            "syncStatus": [
                336
            ],
            "syncStage": [
                337
            ],
            "visibility": [
                338
            ],
            "isContactAutoCreationEnabled": [
                6
            ],
            "contactAutoCreationPolicy": [
                339
            ],
            "isSyncEnabled": [
                6
            ],
            "syncedAt": [
                4
            ],
            "syncStageStartedAt": [
                4
            ],
            "throttleFailureCount": [
                11
            ],
            "connectedAccountId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "CalendarChannelSyncStatus": {},
        "CalendarChannelSyncStage": {},
        "CalendarChannelVisibility": {},
        "CalendarChannelContactAutoCreationPolicy": {},
        "MessageChannel": {
            "id": [
                3
            ],
            "visibility": [
                341
            ],
            "handle": [
                1
            ],
            "type": [
                342
            ],
            "isContactAutoCreationEnabled": [
                6
            ],
            "contactAutoCreationPolicy": [
                343
            ],
            "messageFolderImportPolicy": [
                344
            ],
            "excludeNonProfessionalEmails": [
                6
            ],
            "excludeGroupEmails": [
                6
            ],
            "pendingGroupEmailsAction": [
                345
            ],
            "isSyncEnabled": [
                6
            ],
            "syncedAt": [
                4
            ],
            "syncStatus": [
                346
            ],
            "syncStage": [
                347
            ],
            "syncStageStartedAt": [
                4
            ],
            "throttleFailureCount": [
                11
            ],
            "throttleRetryAfter": [
                4
            ],
            "connectedAccountId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "MessageChannelVisibility": {},
        "MessageChannelType": {},
        "MessageChannelContactAutoCreationPolicy": {},
        "MessageFolderImportPolicy": {},
        "MessageChannelPendingGroupEmailsAction": {},
        "MessageChannelSyncStatus": {},
        "MessageChannelSyncStage": {},
        "MessageFolder": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "isSentFolder": [
                6
            ],
            "isSynced": [
                6
            ],
            "parentFolderId": [
                1
            ],
            "externalId": [
                1
            ],
            "pendingSyncAction": [
                349
            ],
            "messageChannelId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "MessageFolderPendingSyncAction": {},
        "CollectionHash": {
            "collectionName": [
                351
            ],
            "hash": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "AllMetadataName": {},
        "MinimalObjectMetadata": {
            "id": [
                3
            ],
            "nameSingular": [
                1
            ],
            "namePlural": [
                1
            ],
            "labelSingular": [
                1
            ],
            "labelPlural": [
                1
            ],
            "icon": [
                1
            ],
            "color": [
                1
            ],
            "isCustom": [
                6
            ],
            "isActive": [
                6
            ],
            "isSystem": [
                6
            ],
            "isRemote": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "MinimalView": {
            "id": [
                3
            ],
            "type": [
                61
            ],
            "key": [
                62
            ],
            "objectMetadataId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "MinimalMetadata": {
            "objectMetadataItems": [
                352
            ],
            "views": [
                353
            ],
            "collectionHashes": [
                350
            ],
            "__typename": [
                1
            ]
        },
        "Webhook": {
            "id": [
                3
            ],
            "targetUrl": [
                1
            ],
            "operations": [
                1
            ],
            "description": [
                1
            ],
            "secret": [
                1
            ],
            "applicationId": [
                3
            ],
            "createdAt": [
                4
            ],
            "updatedAt": [
                4
            ],
            "deletedAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "Query": {
            "navigationMenuItems": [
                149
            ],
            "navigationMenuItem": [
                149,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "getViewFilterGroups": [
                52,
                {
                    "viewId": [
                        1
                    ]
                }
            ],
            "getViewFilterGroup": [
                52,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViewFilters": [
                54,
                {
                    "viewId": [
                        1
                    ]
                }
            ],
            "getViewFilter": [
                54,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViews": [
                60,
                {
                    "objectMetadataId": [
                        1
                    ],
                    "viewTypes": [
                        61,
                        "[ViewType!]"
                    ]
                }
            ],
            "getView": [
                60,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViewSorts": [
                57,
                {
                    "viewId": [
                        1
                    ]
                }
            ],
            "getViewSort": [
                57,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViewFields": [
                50,
                {
                    "viewId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViewField": [
                50,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViewFieldGroups": [
                59,
                {
                    "viewId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getViewFieldGroup": [
                59,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "apiKeys": [
                2
            ],
            "apiKey": [
                2,
                {
                    "input": [
                        357,
                        "GetApiKeyInput!"
                    ]
                }
            ],
            "enterprisePortalSession": [
                1,
                {
                    "returnUrlPath": [
                        1
                    ]
                }
            ],
            "enterpriseCheckoutSession": [
                1,
                {
                    "billingInterval": [
                        1
                    ]
                }
            ],
            "enterpriseSubscriptionStatus": [
                142
            ],
            "billingPortalSession": [
                139,
                {
                    "returnUrlPath": [
                        1
                    ]
                }
            ],
            "listPlans": [
                138
            ],
            "getMeteredProductsUsage": [
                137
            ],
            "findWorkspaceInvitations": [
                146
            ],
            "getApprovedAccessDomains": [
                144
            ],
            "getPageLayoutTabs": [
                116,
                {
                    "pageLayoutId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getPageLayoutTab": [
                116,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getPageLayouts": [
                117,
                {
                    "objectMetadataId": [
                        1
                    ],
                    "pageLayoutType": [
                        118
                    ]
                }
            ],
            "getPageLayout": [
                117,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getPageLayoutWidgets": [
                75,
                {
                    "pageLayoutTabId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getPageLayoutWidget": [
                75,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findOneLogicFunction": [
                32,
                {
                    "input": [
                        358,
                        "LogicFunctionIdInput!"
                    ]
                }
            ],
            "findManyLogicFunctions": [
                32
            ],
            "getAvailablePackages": [
                15,
                {
                    "input": [
                        358,
                        "LogicFunctionIdInput!"
                    ]
                }
            ],
            "getLogicFunctionSourceCode": [
                1,
                {
                    "input": [
                        358,
                        "LogicFunctionIdInput!"
                    ]
                }
            ],
            "commandMenuItems": [
                298
            ],
            "commandMenuItem": [
                298,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "frontComponents": [
                255
            ],
            "frontComponent": [
                255,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "objectRecordCounts": [
                244
            ],
            "object": [
                46,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "objects": [
                245,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        41,
                        "ObjectFilter!"
                    ]
                }
            ],
            "index": [
                37,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "indexMetadatas": [
                239,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        48,
                        "IndexFilter!"
                    ]
                }
            ],
            "findManyAgents": [
                25
            ],
            "findOneAgent": [
                25,
                {
                    "input": [
                        359,
                        "AgentIdInput!"
                    ]
                }
            ],
            "getRoles": [
                29
            ],
            "getToolIndex": [
                301
            ],
            "getToolInputSchema": [
                15,
                {
                    "toolName": [
                        1,
                        "String!"
                    ]
                }
            ],
            "field": [
                34,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "fields": [
                252,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        47,
                        "FieldFilter!"
                    ]
                }
            ],
            "getViewGroups": [
                56,
                {
                    "viewId": [
                        1
                    ]
                }
            ],
            "getViewGroup": [
                56,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "myMessageFolders": [
                348,
                {
                    "messageChannelId": [
                        3
                    ]
                }
            ],
            "myMessageChannels": [
                340,
                {
                    "connectedAccountId": [
                        3
                    ]
                }
            ],
            "myConnectedAccounts": [
                318
            ],
            "connectedAccounts": [
                318
            ],
            "myCalendarChannels": [
                335,
                {
                    "connectedAccountId": [
                        3
                    ]
                }
            ],
            "webhooks": [
                355
            ],
            "webhook": [
                355,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "minimalMetadata": [
                354
            ],
            "chatThread": [
                324,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "chatMessages": [
                325,
                {
                    "threadId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "chatStreamCatchupChunks": [
                328,
                {
                    "threadId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "getAISystemPromptPreview": [
                327
            ],
            "skills": [
                323
            ],
            "skill": [
                323,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "chatThreads": [
                332,
                {
                    "paging": [
                        39,
                        "CursorPaging!"
                    ],
                    "filter": [
                        360,
                        "AgentChatThreadFilter!"
                    ],
                    "sorting": [
                        363,
                        "[AgentChatThreadSort!]!"
                    ]
                }
            ],
            "agentTurns": [
                334,
                {
                    "agentId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "eventLogs": [
                322,
                {
                    "input": [
                        367,
                        "EventLogQueryInput!"
                    ]
                }
            ],
            "pieChartData": [
                316,
                {
                    "input": [
                        371,
                        "PieChartDataInput!"
                    ]
                }
            ],
            "lineChartData": [
                314,
                {
                    "input": [
                        372,
                        "LineChartDataInput!"
                    ]
                }
            ],
            "barChartData": [
                311,
                {
                    "input": [
                        373,
                        "BarChartDataInput!"
                    ]
                }
            ],
            "checkUserExists": [
                274,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ]
                }
            ],
            "checkWorkspaceInviteHashIsValid": [
                275,
                {
                    "inviteHash": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findWorkspaceFromInviteHash": [
                66,
                {
                    "inviteHash": [
                        1,
                        "String!"
                    ]
                }
            ],
            "validatePasswordResetToken": [
                269,
                {
                    "passwordResetToken": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findApplicationRegistrationByClientId": [
                221,
                {
                    "clientId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findApplicationRegistrationByUniversalIdentifier": [
                7,
                {
                    "universalIdentifier": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findManyApplicationRegistrations": [
                7
            ],
            "findOneApplicationRegistration": [
                7,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findApplicationRegistrationStats": [
                219,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findApplicationRegistrationVariables": [
                5,
                {
                    "applicationRegistrationId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "applicationRegistrationTarballUrl": [
                1,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "currentUser": [
                69
            ],
            "currentWorkspace": [
                66
            ],
            "getPublicWorkspaceDataByDomain": [
                167,
                {
                    "origin": [
                        1
                    ]
                }
            ],
            "getSSOIdentityProviders": [
                227
            ],
            "getConnectedImapSmtpCaldavAccount": [
                295,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "getAutoCompleteAddress": [
                290,
                {
                    "address": [
                        1,
                        "String!"
                    ],
                    "token": [
                        1,
                        "String!"
                    ],
                    "country": [
                        1
                    ],
                    "isFieldCity": [
                        6
                    ]
                }
            ],
            "getAddressDetails": [
                292,
                {
                    "placeId": [
                        1,
                        "String!"
                    ],
                    "token": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getConfigVariablesGrouped": [
                191
            ],
            "getSystemHealthStatus": [
                202
            ],
            "getIndicatorHealthStatus": [
                209,
                {
                    "indicatorId": [
                        200,
                        "HealthIndicatorId!"
                    ]
                }
            ],
            "getQueueMetrics": [
                216,
                {
                    "queueName": [
                        1,
                        "String!"
                    ],
                    "timeRange": [
                        217
                    ]
                }
            ],
            "versionInfo": [
                207
            ],
            "getAdminAiModels": [
                172
            ],
            "getDatabaseConfigVariable": [
                186,
                {
                    "key": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getQueueJobs": [
                197,
                {
                    "queueName": [
                        1,
                        "String!"
                    ],
                    "state": [
                        195,
                        "JobState!"
                    ],
                    "limit": [
                        21
                    ],
                    "offset": [
                        21
                    ]
                }
            ],
            "findAllApplicationRegistrations": [
                7
            ],
            "getAiProviders": [
                15
            ],
            "getModelsDevProviders": [
                212
            ],
            "getModelsDevSuggestions": [
                211,
                {
                    "providerType": [
                        1,
                        "String!"
                    ]
                }
            ],
            "getAdminAiUsageByWorkspace": [
                185,
                {
                    "periodStart": [
                        4
                    ],
                    "periodEnd": [
                        4
                    ]
                }
            ],
            "getMaintenanceMode": [
                210
            ],
            "getUsageAnalytics": [
                279,
                {
                    "input": [
                        374
                    ]
                }
            ],
            "getPostgresCredentials": [
                297
            ],
            "findManyPublicDomains": [
                285
            ],
            "getEmailingDomains": [
                287
            ],
            "findManyMarketplaceApps": [
                283
            ],
            "findMarketplaceAppDetail": [
                284,
                {
                    "universalIdentifier": [
                        1,
                        "String!"
                    ]
                }
            ],
            "findManyApplications": [
                49
            ],
            "findOneApplication": [
                49,
                {
                    "id": [
                        3
                    ],
                    "universalIdentifier": [
                        3
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "GetApiKeyInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "LogicFunctionIdInput": {
            "id": [
                307
            ],
            "__typename": [
                1
            ]
        },
        "AgentIdInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatThreadFilter": {
            "and": [
                360
            ],
            "or": [
                360
            ],
            "id": [
                42
            ],
            "updatedAt": [
                361
            ],
            "__typename": [
                1
            ]
        },
        "DateFieldComparison": {
            "is": [
                6
            ],
            "isNot": [
                6
            ],
            "eq": [
                4
            ],
            "neq": [
                4
            ],
            "gt": [
                4
            ],
            "gte": [
                4
            ],
            "lt": [
                4
            ],
            "lte": [
                4
            ],
            "in": [
                4
            ],
            "notIn": [
                4
            ],
            "between": [
                362
            ],
            "notBetween": [
                362
            ],
            "__typename": [
                1
            ]
        },
        "DateFieldComparisonBetween": {
            "lower": [
                4
            ],
            "upper": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatThreadSort": {
            "field": [
                364
            ],
            "direction": [
                365
            ],
            "nulls": [
                366
            ],
            "__typename": [
                1
            ]
        },
        "AgentChatThreadSortFields": {},
        "SortDirection": {},
        "SortNulls": {},
        "EventLogQueryInput": {
            "table": [
                368
            ],
            "filters": [
                369
            ],
            "first": [
                21
            ],
            "after": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "EventLogTable": {},
        "EventLogFiltersInput": {
            "eventType": [
                1
            ],
            "userWorkspaceId": [
                1
            ],
            "dateRange": [
                370
            ],
            "recordId": [
                1
            ],
            "objectMetadataId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "EventLogDateRangeInput": {
            "start": [
                4
            ],
            "end": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "PieChartDataInput": {
            "objectMetadataId": [
                3
            ],
            "configuration": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "LineChartDataInput": {
            "objectMetadataId": [
                3
            ],
            "configuration": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "BarChartDataInput": {
            "objectMetadataId": [
                3
            ],
            "configuration": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "UsageAnalyticsInput": {
            "periodStart": [
                4
            ],
            "periodEnd": [
                4
            ],
            "userWorkspaceId": [
                1
            ],
            "operationTypes": [
                375
            ],
            "__typename": [
                1
            ]
        },
        "UsageOperationType": {},
        "Mutation": {
            "addQueryToEventStream": [
                6,
                {
                    "input": [
                        377,
                        "AddQuerySubscriptionInput!"
                    ]
                }
            ],
            "removeQueryFromEventStream": [
                6,
                {
                    "input": [
                        378,
                        "RemoveQueryFromEventStreamInput!"
                    ]
                }
            ],
            "createManyNavigationMenuItems": [
                149,
                {
                    "inputs": [
                        379,
                        "[CreateNavigationMenuItemInput!]!"
                    ]
                }
            ],
            "createNavigationMenuItem": [
                149,
                {
                    "input": [
                        379,
                        "CreateNavigationMenuItemInput!"
                    ]
                }
            ],
            "updateManyNavigationMenuItems": [
                149,
                {
                    "inputs": [
                        380,
                        "[UpdateOneNavigationMenuItemInput!]!"
                    ]
                }
            ],
            "updateNavigationMenuItem": [
                149,
                {
                    "input": [
                        380,
                        "UpdateOneNavigationMenuItemInput!"
                    ]
                }
            ],
            "deleteManyNavigationMenuItems": [
                149,
                {
                    "ids": [
                        3,
                        "[UUID!]!"
                    ]
                }
            ],
            "deleteNavigationMenuItem": [
                149,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "uploadAIChatFile": [
                145,
                {
                    "file": [
                        382,
                        "Upload!"
                    ]
                }
            ],
            "uploadWorkflowFile": [
                145,
                {
                    "file": [
                        382,
                        "Upload!"
                    ]
                }
            ],
            "uploadWorkspaceLogo": [
                145,
                {
                    "file": [
                        382,
                        "Upload!"
                    ]
                }
            ],
            "uploadWorkspaceMemberProfilePicture": [
                145,
                {
                    "file": [
                        382,
                        "Upload!"
                    ]
                }
            ],
            "uploadFilesFieldFile": [
                145,
                {
                    "file": [
                        382,
                        "Upload!"
                    ],
                    "fieldMetadataId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "uploadFilesFieldFileByUniversalIdentifier": [
                145,
                {
                    "file": [
                        382,
                        "Upload!"
                    ],
                    "fieldMetadataUniversalIdentifier": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createViewFilterGroup": [
                52,
                {
                    "input": [
                        383,
                        "CreateViewFilterGroupInput!"
                    ]
                }
            ],
            "updateViewFilterGroup": [
                52,
                {
                    "id": [
                        1,
                        "String!"
                    ],
                    "input": [
                        384,
                        "UpdateViewFilterGroupInput!"
                    ]
                }
            ],
            "deleteViewFilterGroup": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "destroyViewFilterGroup": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createViewFilter": [
                54,
                {
                    "input": [
                        385,
                        "CreateViewFilterInput!"
                    ]
                }
            ],
            "updateViewFilter": [
                54,
                {
                    "input": [
                        386,
                        "UpdateViewFilterInput!"
                    ]
                }
            ],
            "deleteViewFilter": [
                54,
                {
                    "input": [
                        388,
                        "DeleteViewFilterInput!"
                    ]
                }
            ],
            "destroyViewFilter": [
                54,
                {
                    "input": [
                        389,
                        "DestroyViewFilterInput!"
                    ]
                }
            ],
            "createView": [
                60,
                {
                    "input": [
                        390,
                        "CreateViewInput!"
                    ]
                }
            ],
            "updateView": [
                60,
                {
                    "id": [
                        1,
                        "String!"
                    ],
                    "input": [
                        391,
                        "UpdateViewInput!"
                    ]
                }
            ],
            "deleteView": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "destroyView": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createViewSort": [
                57,
                {
                    "input": [
                        392,
                        "CreateViewSortInput!"
                    ]
                }
            ],
            "updateViewSort": [
                57,
                {
                    "input": [
                        393,
                        "UpdateViewSortInput!"
                    ]
                }
            ],
            "deleteViewSort": [
                6,
                {
                    "input": [
                        395,
                        "DeleteViewSortInput!"
                    ]
                }
            ],
            "destroyViewSort": [
                6,
                {
                    "input": [
                        396,
                        "DestroyViewSortInput!"
                    ]
                }
            ],
            "updateViewField": [
                50,
                {
                    "input": [
                        397,
                        "UpdateViewFieldInput!"
                    ]
                }
            ],
            "createViewField": [
                50,
                {
                    "input": [
                        399,
                        "CreateViewFieldInput!"
                    ]
                }
            ],
            "createManyViewFields": [
                50,
                {
                    "inputs": [
                        399,
                        "[CreateViewFieldInput!]!"
                    ]
                }
            ],
            "deleteViewField": [
                50,
                {
                    "input": [
                        400,
                        "DeleteViewFieldInput!"
                    ]
                }
            ],
            "destroyViewField": [
                50,
                {
                    "input": [
                        401,
                        "DestroyViewFieldInput!"
                    ]
                }
            ],
            "updateViewFieldGroup": [
                59,
                {
                    "input": [
                        402,
                        "UpdateViewFieldGroupInput!"
                    ]
                }
            ],
            "createViewFieldGroup": [
                59,
                {
                    "input": [
                        404,
                        "CreateViewFieldGroupInput!"
                    ]
                }
            ],
            "createManyViewFieldGroups": [
                59,
                {
                    "inputs": [
                        404,
                        "[CreateViewFieldGroupInput!]!"
                    ]
                }
            ],
            "deleteViewFieldGroup": [
                59,
                {
                    "input": [
                        405,
                        "DeleteViewFieldGroupInput!"
                    ]
                }
            ],
            "destroyViewFieldGroup": [
                59,
                {
                    "input": [
                        406,
                        "DestroyViewFieldGroupInput!"
                    ]
                }
            ],
            "upsertFieldsWidget": [
                60,
                {
                    "input": [
                        407,
                        "UpsertFieldsWidgetInput!"
                    ]
                }
            ],
            "createApiKey": [
                2,
                {
                    "input": [
                        410,
                        "CreateApiKeyInput!"
                    ]
                }
            ],
            "updateApiKey": [
                2,
                {
                    "input": [
                        411,
                        "UpdateApiKeyInput!"
                    ]
                }
            ],
            "revokeApiKey": [
                2,
                {
                    "input": [
                        412,
                        "RevokeApiKeyInput!"
                    ]
                }
            ],
            "assignRoleToApiKey": [
                6,
                {
                    "apiKeyId": [
                        3,
                        "UUID!"
                    ],
                    "roleId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createObjectEvent": [
                119,
                {
                    "event": [
                        1,
                        "String!"
                    ],
                    "recordId": [
                        3,
                        "UUID!"
                    ],
                    "objectMetadataId": [
                        3,
                        "UUID!"
                    ],
                    "properties": [
                        15
                    ]
                }
            ],
            "trackAnalytics": [
                119,
                {
                    "type": [
                        413,
                        "AnalyticsType!"
                    ],
                    "name": [
                        1
                    ],
                    "event": [
                        1
                    ],
                    "properties": [
                        15
                    ]
                }
            ],
            "refreshEnterpriseValidityToken": [
                6
            ],
            "setEnterpriseKey": [
                141,
                {
                    "enterpriseKey": [
                        1,
                        "String!"
                    ]
                }
            ],
            "skipSyncEmailOnboardingStep": [
                143
            ],
            "skipBookOnboardingStep": [
                143
            ],
            "checkoutSession": [
                139,
                {
                    "recurringInterval": [
                        127,
                        "SubscriptionInterval!"
                    ],
                    "plan": [
                        123,
                        "BillingPlanKey!"
                    ],
                    "requirePaymentMethod": [
                        6,
                        "Boolean!"
                    ],
                    "successUrlPath": [
                        1
                    ]
                }
            ],
            "switchSubscriptionInterval": [
                140
            ],
            "switchBillingPlan": [
                140
            ],
            "cancelSwitchBillingPlan": [
                140
            ],
            "cancelSwitchBillingInterval": [
                140
            ],
            "setMeteredSubscriptionPrice": [
                140,
                {
                    "priceId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "endSubscriptionTrialPeriod": [
                136
            ],
            "cancelSwitchMeteredPrice": [
                140
            ],
            "deleteWorkspaceInvitation": [
                1,
                {
                    "appTokenId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "resendWorkspaceInvitation": [
                147,
                {
                    "appTokenId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "sendInvitations": [
                147,
                {
                    "emails": [
                        1,
                        "[String!]!"
                    ],
                    "roleId": [
                        3
                    ]
                }
            ],
            "createApprovedAccessDomain": [
                144,
                {
                    "input": [
                        414,
                        "CreateApprovedAccessDomainInput!"
                    ]
                }
            ],
            "deleteApprovedAccessDomain": [
                6,
                {
                    "input": [
                        415,
                        "DeleteApprovedAccessDomainInput!"
                    ]
                }
            ],
            "validateApprovedAccessDomain": [
                144,
                {
                    "input": [
                        416,
                        "ValidateApprovedAccessDomainInput!"
                    ]
                }
            ],
            "createPageLayoutTab": [
                116,
                {
                    "input": [
                        417,
                        "CreatePageLayoutTabInput!"
                    ]
                }
            ],
            "updatePageLayoutTab": [
                116,
                {
                    "id": [
                        1,
                        "String!"
                    ],
                    "input": [
                        418,
                        "UpdatePageLayoutTabInput!"
                    ]
                }
            ],
            "destroyPageLayoutTab": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createPageLayout": [
                117,
                {
                    "input": [
                        419,
                        "CreatePageLayoutInput!"
                    ]
                }
            ],
            "updatePageLayout": [
                117,
                {
                    "id": [
                        1,
                        "String!"
                    ],
                    "input": [
                        420,
                        "UpdatePageLayoutInput!"
                    ]
                }
            ],
            "destroyPageLayout": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "updatePageLayoutWithTabsAndWidgets": [
                117,
                {
                    "id": [
                        1,
                        "String!"
                    ],
                    "input": [
                        421,
                        "UpdatePageLayoutWithTabsInput!"
                    ]
                }
            ],
            "resetPageLayoutWidgetToDefault": [
                75,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createPageLayoutWidget": [
                75,
                {
                    "input": [
                        425,
                        "CreatePageLayoutWidgetInput!"
                    ]
                }
            ],
            "updatePageLayoutWidget": [
                75,
                {
                    "id": [
                        1,
                        "String!"
                    ],
                    "input": [
                        426,
                        "UpdatePageLayoutWidgetInput!"
                    ]
                }
            ],
            "destroyPageLayoutWidget": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteOneLogicFunction": [
                32,
                {
                    "input": [
                        358,
                        "LogicFunctionIdInput!"
                    ]
                }
            ],
            "createOneLogicFunction": [
                32,
                {
                    "input": [
                        427,
                        "CreateLogicFunctionFromSourceInput!"
                    ]
                }
            ],
            "executeOneLogicFunction": [
                158,
                {
                    "input": [
                        428,
                        "ExecuteOneLogicFunctionInput!"
                    ]
                }
            ],
            "updateOneLogicFunction": [
                6,
                {
                    "input": [
                        429,
                        "UpdateLogicFunctionFromSourceInput!"
                    ]
                }
            ],
            "createCommandMenuItem": [
                298,
                {
                    "input": [
                        431,
                        "CreateCommandMenuItemInput!"
                    ]
                }
            ],
            "updateCommandMenuItem": [
                298,
                {
                    "input": [
                        432,
                        "UpdateCommandMenuItemInput!"
                    ]
                }
            ],
            "deleteCommandMenuItem": [
                298,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createFrontComponent": [
                255,
                {
                    "input": [
                        433,
                        "CreateFrontComponentInput!"
                    ]
                }
            ],
            "updateFrontComponent": [
                255,
                {
                    "input": [
                        434,
                        "UpdateFrontComponentInput!"
                    ]
                }
            ],
            "deleteFrontComponent": [
                255,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createOneObject": [
                46,
                {
                    "input": [
                        436,
                        "CreateOneObjectInput!"
                    ]
                }
            ],
            "deleteOneObject": [
                46,
                {
                    "input": [
                        438,
                        "DeleteOneObjectInput!"
                    ]
                }
            ],
            "updateOneObject": [
                46,
                {
                    "input": [
                        439,
                        "UpdateOneObjectInput!"
                    ]
                }
            ],
            "createOneAgent": [
                25,
                {
                    "input": [
                        441,
                        "CreateAgentInput!"
                    ]
                }
            ],
            "updateOneAgent": [
                25,
                {
                    "input": [
                        442,
                        "UpdateAgentInput!"
                    ]
                }
            ],
            "deleteOneAgent": [
                25,
                {
                    "input": [
                        359,
                        "AgentIdInput!"
                    ]
                }
            ],
            "sendCampaign": [
                303,
                {
                    "input": [
                        443,
                        "SendCampaignInput!"
                    ]
                }
            ],
            "scheduleCampaign": [
                303,
                {
                    "input": [
                        444,
                        "ScheduleCampaignInput!"
                    ]
                }
            ],
            "pauseCampaign": [
                303,
                {
                    "input": [
                        445,
                        "PauseCampaignInput!"
                    ]
                }
            ],
            "resumeCampaign": [
                303,
                {
                    "input": [
                        446,
                        "ResumeCampaignInput!"
                    ]
                }
            ],
            "sendTestEmail": [
                303,
                {
                    "input": [
                        447,
                        "SendTestEmailInput!"
                    ]
                }
            ],
            "resolveRecipients": [
                304,
                {
                    "input": [
                        448,
                        "ResolveRecipientsInput!"
                    ]
                }
            ],
            "saveAsTemplate": [
                303,
                {
                    "input": [
                        450,
                        "SaveAsTemplateInput!"
                    ]
                }
            ],
            "loadTemplate": [
                303,
                {
                    "input": [
                        451,
                        "LoadTemplateInput!"
                    ]
                }
            ],
            "createDripCampaign": [
                306,
                {
                    "input": [
                        452,
                        "CreateDripCampaignInput!"
                    ]
                }
            ],
            "activateDripCampaign": [
                305,
                {
                    "input": [
                        453,
                        "ActivateDripCampaignInput!"
                    ]
                }
            ],
            "pauseDripCampaign": [
                305,
                {
                    "input": [
                        454,
                        "PauseDripCampaignInput!"
                    ]
                }
            ],
            "enrollContacts": [
                308,
                {
                    "input": [
                        455,
                        "EnrollContactsInput!"
                    ]
                }
            ],
            "unenrollContact": [
                305,
                {
                    "input": [
                        456,
                        "UnenrollContactInput!"
                    ]
                }
            ],
            "updateWorkspaceMemberRole": [
                20,
                {
                    "workspaceMemberId": [
                        3,
                        "UUID!"
                    ],
                    "roleId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createOneRole": [
                29,
                {
                    "createRoleInput": [
                        457,
                        "CreateRoleInput!"
                    ]
                }
            ],
            "updateOneRole": [
                29,
                {
                    "updateRoleInput": [
                        458,
                        "UpdateRoleInput!"
                    ]
                }
            ],
            "deleteOneRole": [
                1,
                {
                    "roleId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "upsertObjectPermissions": [
                16,
                {
                    "upsertObjectPermissionsInput": [
                        460,
                        "UpsertObjectPermissionsInput!"
                    ]
                }
            ],
            "upsertPermissionFlags": [
                27,
                {
                    "upsertPermissionFlagsInput": [
                        462,
                        "UpsertPermissionFlagsInput!"
                    ]
                }
            ],
            "upsertFieldPermissions": [
                26,
                {
                    "upsertFieldPermissionsInput": [
                        463,
                        "UpsertFieldPermissionsInput!"
                    ]
                }
            ],
            "upsertRowLevelPermissionPredicates": [
                249,
                {
                    "input": [
                        465,
                        "UpsertRowLevelPermissionPredicatesInput!"
                    ]
                }
            ],
            "assignRoleToAgent": [
                6,
                {
                    "agentId": [
                        3,
                        "UUID!"
                    ],
                    "roleId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "removeRoleFromAgent": [
                6,
                {
                    "agentId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createOneField": [
                34,
                {
                    "input": [
                        468,
                        "CreateOneFieldMetadataInput!"
                    ]
                }
            ],
            "updateOneField": [
                34,
                {
                    "input": [
                        470,
                        "UpdateOneFieldMetadataInput!"
                    ]
                }
            ],
            "deleteOneField": [
                34,
                {
                    "input": [
                        472,
                        "DeleteOneFieldInput!"
                    ]
                }
            ],
            "createViewGroup": [
                56,
                {
                    "input": [
                        473,
                        "CreateViewGroupInput!"
                    ]
                }
            ],
            "createManyViewGroups": [
                56,
                {
                    "inputs": [
                        473,
                        "[CreateViewGroupInput!]!"
                    ]
                }
            ],
            "updateViewGroup": [
                56,
                {
                    "input": [
                        474,
                        "UpdateViewGroupInput!"
                    ]
                }
            ],
            "updateManyViewGroups": [
                56,
                {
                    "inputs": [
                        474,
                        "[UpdateViewGroupInput!]!"
                    ]
                }
            ],
            "deleteViewGroup": [
                56,
                {
                    "input": [
                        476,
                        "DeleteViewGroupInput!"
                    ]
                }
            ],
            "destroyViewGroup": [
                56,
                {
                    "input": [
                        477,
                        "DestroyViewGroupInput!"
                    ]
                }
            ],
            "updateMessageFolder": [
                348,
                {
                    "input": [
                        478,
                        "UpdateMessageFolderInput!"
                    ]
                }
            ],
            "updateMessageFolders": [
                348,
                {
                    "input": [
                        480,
                        "UpdateMessageFoldersInput!"
                    ]
                }
            ],
            "updateMessageChannel": [
                340,
                {
                    "input": [
                        481,
                        "UpdateMessageChannelInput!"
                    ]
                }
            ],
            "deleteConnectedAccount": [
                318,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "updateCalendarChannel": [
                335,
                {
                    "input": [
                        483,
                        "UpdateCalendarChannelInput!"
                    ]
                }
            ],
            "createWebhook": [
                355,
                {
                    "input": [
                        485,
                        "CreateWebhookInput!"
                    ]
                }
            ],
            "updateWebhook": [
                355,
                {
                    "input": [
                        486,
                        "UpdateWebhookInput!"
                    ]
                }
            ],
            "deleteWebhook": [
                355,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createChatThread": [
                324
            ],
            "sendChatMessage": [
                329,
                {
                    "threadId": [
                        3,
                        "UUID!"
                    ],
                    "text": [
                        1,
                        "String!"
                    ],
                    "messageId": [
                        3,
                        "UUID!"
                    ],
                    "browsingContext": [
                        15
                    ],
                    "modelId": [
                        1
                    ]
                }
            ],
            "stopAgentChatStream": [
                6,
                {
                    "threadId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "deleteQueuedChatMessage": [
                6,
                {
                    "messageId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createSkill": [
                323,
                {
                    "input": [
                        488,
                        "CreateSkillInput!"
                    ]
                }
            ],
            "updateSkill": [
                323,
                {
                    "input": [
                        489,
                        "UpdateSkillInput!"
                    ]
                }
            ],
            "deleteSkill": [
                323,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "activateSkill": [
                323,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "deactivateSkill": [
                323,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "evaluateAgentTurn": [
                333,
                {
                    "turnId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "runEvaluationInput": [
                334,
                {
                    "agentId": [
                        3,
                        "UUID!"
                    ],
                    "input": [
                        1,
                        "String!"
                    ]
                }
            ],
            "duplicateDashboard": [
                317,
                {
                    "id": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "getAuthorizationUrlForSSO": [
                264,
                {
                    "input": [
                        490,
                        "GetAuthorizationUrlForSSOInput!"
                    ]
                }
            ],
            "getLoginTokenFromCredentials": [
                273,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ],
                    "locale": [
                        1
                    ],
                    "verifyEmailRedirectPath": [
                        1
                    ],
                    "origin": [
                        1,
                        "String!"
                    ]
                }
            ],
            "signIn": [
                262,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ],
                    "locale": [
                        1
                    ],
                    "verifyEmailRedirectPath": [
                        1
                    ]
                }
            ],
            "verifyEmailAndGetLoginToken": [
                270,
                {
                    "emailVerificationToken": [
                        1,
                        "String!"
                    ],
                    "email": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ],
                    "origin": [
                        1,
                        "String!"
                    ]
                }
            ],
            "verifyEmailAndGetWorkspaceAgnosticToken": [
                262,
                {
                    "emailVerificationToken": [
                        1,
                        "String!"
                    ],
                    "email": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ]
                }
            ],
            "getAuthTokensFromOTP": [
                272,
                {
                    "otp": [
                        1,
                        "String!"
                    ],
                    "loginToken": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ],
                    "origin": [
                        1,
                        "String!"
                    ]
                }
            ],
            "signUp": [
                262,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ],
                    "captchaToken": [
                        1
                    ],
                    "locale": [
                        1
                    ],
                    "verifyEmailRedirectPath": [
                        1
                    ]
                }
            ],
            "signUpInWorkspace": [
                267,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ],
                    "workspaceId": [
                        3
                    ],
                    "workspaceInviteHash": [
                        1
                    ],
                    "workspacePersonalInviteToken": [
                        1
                    ],
                    "captchaToken": [
                        1
                    ],
                    "locale": [
                        1
                    ],
                    "verifyEmailRedirectPath": [
                        1
                    ]
                }
            ],
            "signUpInNewWorkspace": [
                267
            ],
            "generateTransientToken": [
                268
            ],
            "getAuthTokensFromLoginToken": [
                272,
                {
                    "loginToken": [
                        1,
                        "String!"
                    ],
                    "origin": [
                        1,
                        "String!"
                    ]
                }
            ],
            "authorizeApp": [
                260,
                {
                    "clientId": [
                        1,
                        "String!"
                    ],
                    "codeChallenge": [
                        1
                    ],
                    "redirectUrl": [
                        1,
                        "String!"
                    ],
                    "state": [
                        1
                    ],
                    "scope": [
                        1
                    ]
                }
            ],
            "renewToken": [
                272,
                {
                    "appToken": [
                        1,
                        "String!"
                    ]
                }
            ],
            "generateApiKeyToken": [
                271,
                {
                    "apiKeyId": [
                        3,
                        "UUID!"
                    ],
                    "expiresAt": [
                        1,
                        "String!"
                    ]
                }
            ],
            "emailPasswordResetLink": [
                263,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "workspaceId": [
                        3
                    ]
                }
            ],
            "updatePasswordViaResetToken": [
                265,
                {
                    "passwordResetToken": [
                        1,
                        "String!"
                    ],
                    "newPassword": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createApplicationRegistration": [
                220,
                {
                    "input": [
                        491,
                        "CreateApplicationRegistrationInput!"
                    ]
                }
            ],
            "updateApplicationRegistration": [
                7,
                {
                    "input": [
                        492,
                        "UpdateApplicationRegistrationInput!"
                    ]
                }
            ],
            "deleteApplicationRegistration": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "rotateApplicationRegistrationClientSecret": [
                222,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createApplicationRegistrationVariable": [
                5,
                {
                    "input": [
                        494,
                        "CreateApplicationRegistrationVariableInput!"
                    ]
                }
            ],
            "updateApplicationRegistrationVariable": [
                5,
                {
                    "input": [
                        495,
                        "UpdateApplicationRegistrationVariableInput!"
                    ]
                }
            ],
            "deleteApplicationRegistrationVariable": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "uploadAppTarball": [
                7,
                {
                    "file": [
                        382,
                        "Upload!"
                    ],
                    "universalIdentifier": [
                        1
                    ]
                }
            ],
            "transferApplicationRegistrationOwnership": [
                7,
                {
                    "applicationRegistrationId": [
                        1,
                        "String!"
                    ],
                    "targetWorkspaceSubdomain": [
                        1,
                        "String!"
                    ]
                }
            ],
            "initiateOTPProvisioning": [
                258,
                {
                    "loginToken": [
                        1,
                        "String!"
                    ],
                    "origin": [
                        1,
                        "String!"
                    ]
                }
            ],
            "initiateOTPProvisioningForAuthenticatedUser": [
                258
            ],
            "deleteTwoFactorAuthenticationMethod": [
                257,
                {
                    "twoFactorAuthenticationMethodId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "verifyTwoFactorAuthenticationMethodForAuthenticatedUser": [
                259,
                {
                    "otp": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteUser": [
                69
            ],
            "deleteUserFromWorkspace": [
                17,
                {
                    "workspaceMemberIdToDelete": [
                        1,
                        "String!"
                    ]
                }
            ],
            "updateUserEmail": [
                6,
                {
                    "newEmail": [
                        1,
                        "String!"
                    ],
                    "verifyEmailRedirectPath": [
                        1
                    ]
                }
            ],
            "resendEmailVerificationToken": [
                223,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "origin": [
                        1,
                        "String!"
                    ]
                }
            ],
            "activateWorkspace": [
                66,
                {
                    "data": [
                        497,
                        "ActivateWorkspaceInput!"
                    ]
                }
            ],
            "updateWorkspace": [
                66,
                {
                    "data": [
                        498,
                        "UpdateWorkspaceInput!"
                    ]
                }
            ],
            "deleteCurrentWorkspace": [
                66
            ],
            "checkCustomDomainValidRecords": [
                236
            ],
            "createOIDCIdentityProvider": [
                228,
                {
                    "input": [
                        499,
                        "SetupOIDCSsoInput!"
                    ]
                }
            ],
            "createSAMLIdentityProvider": [
                228,
                {
                    "input": [
                        500,
                        "SetupSAMLSsoInput!"
                    ]
                }
            ],
            "deleteSSOIdentityProvider": [
                224,
                {
                    "input": [
                        501,
                        "DeleteSsoInput!"
                    ]
                }
            ],
            "editSSOIdentityProvider": [
                225,
                {
                    "input": [
                        502,
                        "EditSsoInput!"
                    ]
                }
            ],
            "impersonate": [
                276,
                {
                    "userId": [
                        3,
                        "UUID!"
                    ],
                    "workspaceId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "sendEmail": [
                319,
                {
                    "input": [
                        503,
                        "SendEmailInput!"
                    ]
                }
            ],
            "startChannelSync": [
                309,
                {
                    "connectedAccountId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "saveImapSmtpCaldavAccount": [
                296,
                {
                    "accountOwnerId": [
                        3,
                        "UUID!"
                    ],
                    "handle": [
                        1,
                        "String!"
                    ],
                    "connectionParameters": [
                        504,
                        "EmailAccountConnectionParameters!"
                    ],
                    "id": [
                        3
                    ]
                }
            ],
            "updateLabPublicFeatureFlag": [
                203,
                {
                    "input": [
                        506,
                        "UpdateLabPublicFeatureFlagInput!"
                    ]
                }
            ],
            "userLookupAdminPanel": [
                206,
                {
                    "userIdentifier": [
                        1,
                        "String!"
                    ]
                }
            ],
            "updateWorkspaceFeatureFlag": [
                6,
                {
                    "workspaceId": [
                        3,
                        "UUID!"
                    ],
                    "featureFlag": [
                        1,
                        "String!"
                    ],
                    "value": [
                        6,
                        "Boolean!"
                    ]
                }
            ],
            "setAdminAiModelEnabled": [
                6,
                {
                    "modelId": [
                        1,
                        "String!"
                    ],
                    "enabled": [
                        6,
                        "Boolean!"
                    ]
                }
            ],
            "setAdminAiModelRecommended": [
                6,
                {
                    "modelId": [
                        1,
                        "String!"
                    ],
                    "recommended": [
                        6,
                        "Boolean!"
                    ]
                }
            ],
            "setAdminDefaultAiModel": [
                6,
                {
                    "role": [
                        507,
                        "AiModelRole!"
                    ],
                    "modelId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createDatabaseConfigVariable": [
                6,
                {
                    "key": [
                        1,
                        "String!"
                    ],
                    "value": [
                        15,
                        "JSON!"
                    ]
                }
            ],
            "updateDatabaseConfigVariable": [
                6,
                {
                    "key": [
                        1,
                        "String!"
                    ],
                    "value": [
                        15,
                        "JSON!"
                    ]
                }
            ],
            "deleteDatabaseConfigVariable": [
                6,
                {
                    "key": [
                        1,
                        "String!"
                    ]
                }
            ],
            "retryJobs": [
                198,
                {
                    "queueName": [
                        1,
                        "String!"
                    ],
                    "jobIds": [
                        1,
                        "[String!]!"
                    ]
                }
            ],
            "deleteJobs": [
                193,
                {
                    "queueName": [
                        1,
                        "String!"
                    ],
                    "jobIds": [
                        1,
                        "[String!]!"
                    ]
                }
            ],
            "addAiProvider": [
                6,
                {
                    "providerName": [
                        1,
                        "String!"
                    ],
                    "providerConfig": [
                        15,
                        "JSON!"
                    ]
                }
            ],
            "removeAiProvider": [
                6,
                {
                    "providerName": [
                        1,
                        "String!"
                    ]
                }
            ],
            "addModelToProvider": [
                6,
                {
                    "providerName": [
                        1,
                        "String!"
                    ],
                    "modelConfig": [
                        15,
                        "JSON!"
                    ]
                }
            ],
            "removeModelFromProvider": [
                6,
                {
                    "providerName": [
                        1,
                        "String!"
                    ],
                    "modelName": [
                        1,
                        "String!"
                    ]
                }
            ],
            "setMaintenanceMode": [
                6,
                {
                    "startAt": [
                        4,
                        "DateTime!"
                    ],
                    "endAt": [
                        4,
                        "DateTime!"
                    ],
                    "link": [
                        1
                    ]
                }
            ],
            "clearMaintenanceMode": [
                6
            ],
            "enablePostgresProxy": [
                297
            ],
            "disablePostgresProxy": [
                297
            ],
            "createPublicDomain": [
                285,
                {
                    "domain": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deletePublicDomain": [
                6,
                {
                    "domain": [
                        1,
                        "String!"
                    ]
                }
            ],
            "checkPublicDomainValidRecords": [
                236,
                {
                    "domain": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createEmailingDomain": [
                287,
                {
                    "domain": [
                        1,
                        "String!"
                    ],
                    "driver": [
                        288,
                        "EmailingDomainDriver!"
                    ]
                }
            ],
            "deleteEmailingDomain": [
                6,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "verifyEmailingDomain": [
                287,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createOneAppToken": [
                68,
                {
                    "input": [
                        508,
                        "CreateOneAppTokenInput!"
                    ]
                }
            ],
            "installMarketplaceApp": [
                6,
                {
                    "universalIdentifier": [
                        1,
                        "String!"
                    ],
                    "version": [
                        1
                    ]
                }
            ],
            "syncMarketplaceCatalog": [
                6
            ],
            "installApplication": [
                6,
                {
                    "appRegistrationId": [
                        1,
                        "String!"
                    ],
                    "version": [
                        1
                    ]
                }
            ],
            "runWorkspaceMigration": [
                6,
                {
                    "workspaceMigration": [
                        510,
                        "WorkspaceMigrationInput!"
                    ]
                }
            ],
            "uninstallApplication": [
                6,
                {
                    "universalIdentifier": [
                        1,
                        "String!"
                    ]
                }
            ],
            "updateOneApplicationVariable": [
                6,
                {
                    "key": [
                        1,
                        "String!"
                    ],
                    "value": [
                        1,
                        "String!"
                    ],
                    "applicationId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "createDevelopmentApplication": [
                280,
                {
                    "universalIdentifier": [
                        1,
                        "String!"
                    ],
                    "name": [
                        1,
                        "String!"
                    ]
                }
            ],
            "generateApplicationToken": [
                254,
                {
                    "applicationId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "syncApplication": [
                281,
                {
                    "manifest": [
                        15,
                        "JSON!"
                    ]
                }
            ],
            "uploadApplicationFile": [
                282,
                {
                    "file": [
                        382,
                        "Upload!"
                    ],
                    "applicationUniversalIdentifier": [
                        1,
                        "String!"
                    ],
                    "fileFolder": [
                        513,
                        "FileFolder!"
                    ],
                    "filePath": [
                        1,
                        "String!"
                    ]
                }
            ],
            "upgradeApplication": [
                6,
                {
                    "appRegistrationId": [
                        1,
                        "String!"
                    ],
                    "targetVersion": [
                        1,
                        "String!"
                    ]
                }
            ],
            "renewApplicationToken": [
                254,
                {
                    "applicationRefreshToken": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "AddQuerySubscriptionInput": {
            "eventStreamId": [
                1
            ],
            "queryId": [
                1
            ],
            "operationSignature": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "RemoveQueryFromEventStreamInput": {
            "eventStreamId": [
                1
            ],
            "queryId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateNavigationMenuItemInput": {
            "id": [
                3
            ],
            "userWorkspaceId": [
                3
            ],
            "targetRecordId": [
                3
            ],
            "targetObjectMetadataId": [
                3
            ],
            "viewId": [
                3
            ],
            "type": [
                150
            ],
            "name": [
                1
            ],
            "link": [
                1
            ],
            "icon": [
                1
            ],
            "color": [
                1
            ],
            "folderId": [
                3
            ],
            "position": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "UpdateOneNavigationMenuItemInput": {
            "id": [
                3
            ],
            "update": [
                381
            ],
            "__typename": [
                1
            ]
        },
        "UpdateNavigationMenuItemInput": {
            "folderId": [
                3
            ],
            "position": [
                11
            ],
            "name": [
                1
            ],
            "link": [
                1
            ],
            "icon": [
                1
            ],
            "color": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Upload": {},
        "CreateViewFilterGroupInput": {
            "id": [
                3
            ],
            "parentViewFilterGroupId": [
                3
            ],
            "logicalOperator": [
                53
            ],
            "positionInViewFilterGroup": [
                11
            ],
            "viewId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFilterGroupInput": {
            "id": [
                3
            ],
            "parentViewFilterGroupId": [
                3
            ],
            "logicalOperator": [
                53
            ],
            "positionInViewFilterGroup": [
                11
            ],
            "viewId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "CreateViewFilterInput": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "operand": [
                55
            ],
            "value": [
                15
            ],
            "viewFilterGroupId": [
                3
            ],
            "positionInViewFilterGroup": [
                11
            ],
            "subFieldName": [
                1
            ],
            "viewId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFilterInput": {
            "id": [
                3
            ],
            "update": [
                387
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFilterInputUpdates": {
            "fieldMetadataId": [
                3
            ],
            "operand": [
                55
            ],
            "value": [
                15
            ],
            "viewFilterGroupId": [
                3
            ],
            "positionInViewFilterGroup": [
                11
            ],
            "subFieldName": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DeleteViewFilterInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "DestroyViewFilterInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "CreateViewInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "objectMetadataId": [
                3
            ],
            "type": [
                61
            ],
            "key": [
                62
            ],
            "icon": [
                1
            ],
            "position": [
                11
            ],
            "isCompact": [
                6
            ],
            "shouldHideEmptyGroups": [
                6
            ],
            "openRecordIn": [
                63
            ],
            "kanbanAggregateOperation": [
                51
            ],
            "kanbanAggregateOperationFieldMetadataId": [
                3
            ],
            "anyFieldFilterValue": [
                1
            ],
            "calendarLayout": [
                64
            ],
            "calendarFieldMetadataId": [
                3
            ],
            "mainGroupByFieldMetadataId": [
                3
            ],
            "visibility": [
                65
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "type": [
                61
            ],
            "icon": [
                1
            ],
            "position": [
                11
            ],
            "isCompact": [
                6
            ],
            "openRecordIn": [
                63
            ],
            "kanbanAggregateOperation": [
                51
            ],
            "kanbanAggregateOperationFieldMetadataId": [
                3
            ],
            "anyFieldFilterValue": [
                1
            ],
            "calendarLayout": [
                64
            ],
            "calendarFieldMetadataId": [
                3
            ],
            "visibility": [
                65
            ],
            "mainGroupByFieldMetadataId": [
                3
            ],
            "shouldHideEmptyGroups": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "CreateViewSortInput": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "direction": [
                58
            ],
            "viewId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewSortInput": {
            "id": [
                3
            ],
            "update": [
                394
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewSortInputUpdates": {
            "direction": [
                58
            ],
            "__typename": [
                1
            ]
        },
        "DeleteViewSortInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "DestroyViewSortInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFieldInput": {
            "id": [
                3
            ],
            "update": [
                398
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFieldInputUpdates": {
            "isVisible": [
                6
            ],
            "size": [
                11
            ],
            "position": [
                11
            ],
            "aggregateOperation": [
                51
            ],
            "viewFieldGroupId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "CreateViewFieldInput": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "viewId": [
                3
            ],
            "isVisible": [
                6
            ],
            "size": [
                11
            ],
            "position": [
                11
            ],
            "aggregateOperation": [
                51
            ],
            "viewFieldGroupId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "DeleteViewFieldInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "DestroyViewFieldInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFieldGroupInput": {
            "id": [
                3
            ],
            "update": [
                403
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewFieldGroupInputUpdates": {
            "name": [
                1
            ],
            "position": [
                11
            ],
            "isVisible": [
                6
            ],
            "deletedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateViewFieldGroupInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "viewId": [
                3
            ],
            "position": [
                11
            ],
            "isVisible": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "DeleteViewFieldGroupInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "DestroyViewFieldGroupInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpsertFieldsWidgetInput": {
            "widgetId": [
                3
            ],
            "groups": [
                408
            ],
            "fields": [
                409
            ],
            "__typename": [
                1
            ]
        },
        "UpsertFieldsWidgetGroupInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "position": [
                11
            ],
            "isVisible": [
                6
            ],
            "fields": [
                409
            ],
            "__typename": [
                1
            ]
        },
        "UpsertFieldsWidgetFieldInput": {
            "viewFieldId": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "isVisible": [
                6
            ],
            "position": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "CreateApiKeyInput": {
            "name": [
                1
            ],
            "expiresAt": [
                1
            ],
            "revokedAt": [
                1
            ],
            "roleId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateApiKeyInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "expiresAt": [
                1
            ],
            "revokedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "RevokeApiKeyInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "AnalyticsType": {},
        "CreateApprovedAccessDomainInput": {
            "domain": [
                1
            ],
            "email": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DeleteApprovedAccessDomainInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "ValidateApprovedAccessDomainInput": {
            "validationToken": [
                1
            ],
            "approvedAccessDomainId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "CreatePageLayoutTabInput": {
            "title": [
                1
            ],
            "position": [
                11
            ],
            "pageLayoutId": [
                3
            ],
            "layoutMode": [
                79
            ],
            "__typename": [
                1
            ]
        },
        "UpdatePageLayoutTabInput": {
            "title": [
                1
            ],
            "position": [
                11
            ],
            "icon": [
                1
            ],
            "layoutMode": [
                79
            ],
            "__typename": [
                1
            ]
        },
        "CreatePageLayoutInput": {
            "name": [
                1
            ],
            "type": [
                118
            ],
            "objectMetadataId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdatePageLayoutInput": {
            "name": [
                1
            ],
            "type": [
                118
            ],
            "objectMetadataId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdatePageLayoutWithTabsInput": {
            "name": [
                1
            ],
            "type": [
                118
            ],
            "objectMetadataId": [
                3
            ],
            "tabs": [
                422
            ],
            "__typename": [
                1
            ]
        },
        "UpdatePageLayoutTabWithWidgetsInput": {
            "id": [
                3
            ],
            "title": [
                1
            ],
            "position": [
                11
            ],
            "icon": [
                1
            ],
            "layoutMode": [
                79
            ],
            "widgets": [
                423
            ],
            "__typename": [
                1
            ]
        },
        "UpdatePageLayoutWidgetWithIdInput": {
            "id": [
                3
            ],
            "pageLayoutTabId": [
                3
            ],
            "title": [
                1
            ],
            "type": [
                76
            ],
            "objectMetadataId": [
                3
            ],
            "gridPosition": [
                424
            ],
            "position": [
                15
            ],
            "configuration": [
                15
            ],
            "conditionalDisplay": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "GridPositionInput": {
            "row": [
                11
            ],
            "column": [
                11
            ],
            "rowSpan": [
                11
            ],
            "columnSpan": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "CreatePageLayoutWidgetInput": {
            "pageLayoutTabId": [
                3
            ],
            "title": [
                1
            ],
            "type": [
                76
            ],
            "objectMetadataId": [
                3
            ],
            "gridPosition": [
                424
            ],
            "position": [
                15
            ],
            "configuration": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "UpdatePageLayoutWidgetInput": {
            "title": [
                1
            ],
            "type": [
                76
            ],
            "objectMetadataId": [
                3
            ],
            "gridPosition": [
                424
            ],
            "position": [
                15
            ],
            "configuration": [
                15
            ],
            "conditionalDisplay": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "CreateLogicFunctionFromSourceInput": {
            "id": [
                3
            ],
            "universalIdentifier": [
                3
            ],
            "name": [
                1
            ],
            "description": [
                1
            ],
            "timeoutSeconds": [
                11
            ],
            "toolInputSchema": [
                15
            ],
            "isTool": [
                6
            ],
            "source": [
                15
            ],
            "cronTriggerSettings": [
                15
            ],
            "databaseEventTriggerSettings": [
                15
            ],
            "httpRouteTriggerSettings": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "ExecuteOneLogicFunctionInput": {
            "id": [
                3
            ],
            "payload": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "UpdateLogicFunctionFromSourceInput": {
            "id": [
                3
            ],
            "update": [
                430
            ],
            "__typename": [
                1
            ]
        },
        "UpdateLogicFunctionFromSourceInputUpdates": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "timeoutSeconds": [
                11
            ],
            "sourceHandlerCode": [
                1
            ],
            "toolInputSchema": [
                15
            ],
            "handlerName": [
                1
            ],
            "sourceHandlerPath": [
                1
            ],
            "isTool": [
                6
            ],
            "cronTriggerSettings": [
                15
            ],
            "databaseEventTriggerSettings": [
                15
            ],
            "httpRouteTriggerSettings": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "CreateCommandMenuItemInput": {
            "workflowVersionId": [
                3
            ],
            "frontComponentId": [
                3
            ],
            "engineComponentKey": [
                299
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "shortLabel": [
                1
            ],
            "position": [
                11
            ],
            "isPinned": [
                6
            ],
            "availabilityType": [
                300
            ],
            "hotKeys": [
                1
            ],
            "conditionalAvailabilityExpression": [
                1
            ],
            "availabilityObjectMetadataId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateCommandMenuItemInput": {
            "id": [
                3
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "shortLabel": [
                1
            ],
            "position": [
                11
            ],
            "isPinned": [
                6
            ],
            "availabilityType": [
                300
            ],
            "availabilityObjectMetadataId": [
                3
            ],
            "engineComponentKey": [
                299
            ],
            "hotKeys": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateFrontComponentInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "description": [
                1
            ],
            "sourceComponentPath": [
                1
            ],
            "builtComponentPath": [
                1
            ],
            "componentName": [
                1
            ],
            "builtComponentChecksum": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UpdateFrontComponentInput": {
            "id": [
                3
            ],
            "update": [
                435
            ],
            "__typename": [
                1
            ]
        },
        "UpdateFrontComponentInputUpdates": {
            "name": [
                1
            ],
            "description": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateOneObjectInput": {
            "object": [
                437
            ],
            "__typename": [
                1
            ]
        },
        "CreateObjectInput": {
            "nameSingular": [
                1
            ],
            "namePlural": [
                1
            ],
            "labelSingular": [
                1
            ],
            "labelPlural": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "shortcut": [
                1
            ],
            "color": [
                1
            ],
            "skipNameField": [
                6
            ],
            "isRemote": [
                6
            ],
            "primaryKeyColumnType": [
                1
            ],
            "primaryKeyFieldMetadataSettings": [
                15
            ],
            "isLabelSyncedWithName": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "DeleteOneObjectInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateOneObjectInput": {
            "update": [
                440
            ],
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateObjectPayload": {
            "labelSingular": [
                1
            ],
            "labelPlural": [
                1
            ],
            "nameSingular": [
                1
            ],
            "namePlural": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "shortcut": [
                1
            ],
            "color": [
                1
            ],
            "isActive": [
                6
            ],
            "labelIdentifierFieldMetadataId": [
                3
            ],
            "imageIdentifierFieldMetadataId": [
                3
            ],
            "isLabelSyncedWithName": [
                6
            ],
            "isSearchable": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "CreateAgentInput": {
            "name": [
                1
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "description": [
                1
            ],
            "prompt": [
                1
            ],
            "modelId": [
                1
            ],
            "roleId": [
                3
            ],
            "responseFormat": [
                15
            ],
            "modelConfiguration": [
                15
            ],
            "evaluationInputs": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UpdateAgentInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "description": [
                1
            ],
            "prompt": [
                1
            ],
            "modelId": [
                1
            ],
            "roleId": [
                3
            ],
            "responseFormat": [
                15
            ],
            "modelConfiguration": [
                15
            ],
            "evaluationInputs": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "SendCampaignInput": {
            "campaignId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ScheduleCampaignInput": {
            "campaignId": [
                1
            ],
            "scheduledAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "PauseCampaignInput": {
            "campaignId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ResumeCampaignInput": {
            "campaignId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "SendTestEmailInput": {
            "campaignId": [
                1
            ],
            "testEmailAddress": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ResolveRecipientsInput": {
            "campaignId": [
                1
            ],
            "mode": [
                449
            ],
            "viewId": [
                1
            ],
            "personIds": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "RecipientSelectionMode": {},
        "SaveAsTemplateInput": {
            "campaignId": [
                1
            ],
            "templateName": [
                1
            ],
            "category": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "LoadTemplateInput": {
            "templateId": [
                1
            ],
            "campaignId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateDripCampaignInput": {
            "name": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ActivateDripCampaignInput": {
            "dripCampaignId": [
                307
            ],
            "__typename": [
                1
            ]
        },
        "PauseDripCampaignInput": {
            "dripCampaignId": [
                307
            ],
            "__typename": [
                1
            ]
        },
        "EnrollContactsInput": {
            "dripCampaignId": [
                307
            ],
            "personIds": [
                307
            ],
            "__typename": [
                1
            ]
        },
        "UnenrollContactInput": {
            "enrollmentId": [
                307
            ],
            "__typename": [
                1
            ]
        },
        "CreateRoleInput": {
            "id": [
                1
            ],
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "canUpdateAllSettings": [
                6
            ],
            "canAccessAllTools": [
                6
            ],
            "canReadAllObjectRecords": [
                6
            ],
            "canUpdateAllObjectRecords": [
                6
            ],
            "canSoftDeleteAllObjectRecords": [
                6
            ],
            "canDestroyAllObjectRecords": [
                6
            ],
            "canBeAssignedToUsers": [
                6
            ],
            "canBeAssignedToAgents": [
                6
            ],
            "canBeAssignedToApiKeys": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpdateRoleInput": {
            "update": [
                459
            ],
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateRolePayload": {
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "canUpdateAllSettings": [
                6
            ],
            "canAccessAllTools": [
                6
            ],
            "canReadAllObjectRecords": [
                6
            ],
            "canUpdateAllObjectRecords": [
                6
            ],
            "canSoftDeleteAllObjectRecords": [
                6
            ],
            "canDestroyAllObjectRecords": [
                6
            ],
            "canBeAssignedToUsers": [
                6
            ],
            "canBeAssignedToAgents": [
                6
            ],
            "canBeAssignedToApiKeys": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpsertObjectPermissionsInput": {
            "roleId": [
                3
            ],
            "objectPermissions": [
                461
            ],
            "__typename": [
                1
            ]
        },
        "ObjectPermissionInput": {
            "objectMetadataId": [
                3
            ],
            "canReadObjectRecords": [
                6
            ],
            "canUpdateObjectRecords": [
                6
            ],
            "canSoftDeleteObjectRecords": [
                6
            ],
            "canDestroyObjectRecords": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpsertPermissionFlagsInput": {
            "roleId": [
                3
            ],
            "permissionFlagKeys": [
                18
            ],
            "__typename": [
                1
            ]
        },
        "UpsertFieldPermissionsInput": {
            "roleId": [
                3
            ],
            "fieldPermissions": [
                464
            ],
            "__typename": [
                1
            ]
        },
        "FieldPermissionInput": {
            "objectMetadataId": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "canReadFieldValue": [
                6
            ],
            "canUpdateFieldValue": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpsertRowLevelPermissionPredicatesInput": {
            "roleId": [
                3
            ],
            "objectMetadataId": [
                3
            ],
            "predicates": [
                466
            ],
            "predicateGroups": [
                467
            ],
            "__typename": [
                1
            ]
        },
        "RowLevelPermissionPredicateInput": {
            "id": [
                3
            ],
            "fieldMetadataId": [
                3
            ],
            "operand": [
                14
            ],
            "value": [
                15
            ],
            "subFieldName": [
                1
            ],
            "workspaceMemberFieldMetadataId": [
                1
            ],
            "workspaceMemberSubFieldName": [
                1
            ],
            "rowLevelPermissionPredicateGroupId": [
                3
            ],
            "positionInRowLevelPermissionPredicateGroup": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "RowLevelPermissionPredicateGroupInput": {
            "id": [
                3
            ],
            "objectMetadataId": [
                3
            ],
            "parentRowLevelPermissionPredicateGroupId": [
                3
            ],
            "logicalOperator": [
                12
            ],
            "positionInRowLevelPermissionPredicateGroup": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "CreateOneFieldMetadataInput": {
            "field": [
                469
            ],
            "__typename": [
                1
            ]
        },
        "CreateFieldInput": {
            "type": [
                35
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "isCustom": [
                6
            ],
            "isActive": [
                6
            ],
            "isSystem": [
                6
            ],
            "isUIReadOnly": [
                6
            ],
            "isNullable": [
                6
            ],
            "isUnique": [
                6
            ],
            "defaultValue": [
                15
            ],
            "options": [
                15
            ],
            "settings": [
                15
            ],
            "objectMetadataId": [
                3
            ],
            "isLabelSyncedWithName": [
                6
            ],
            "isRemoteCreation": [
                6
            ],
            "relationCreationPayload": [
                15
            ],
            "morphRelationsCreationPayload": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "UpdateOneFieldMetadataInput": {
            "id": [
                3
            ],
            "update": [
                471
            ],
            "__typename": [
                1
            ]
        },
        "UpdateFieldInput": {
            "universalIdentifier": [
                1
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "description": [
                1
            ],
            "icon": [
                1
            ],
            "isActive": [
                6
            ],
            "isSystem": [
                6
            ],
            "isUIReadOnly": [
                6
            ],
            "isNullable": [
                6
            ],
            "isUnique": [
                6
            ],
            "defaultValue": [
                15
            ],
            "options": [
                15
            ],
            "settings": [
                15
            ],
            "objectMetadataId": [
                3
            ],
            "isLabelSyncedWithName": [
                6
            ],
            "morphRelationsUpdatePayload": [
                15
            ],
            "__typename": [
                1
            ]
        },
        "DeleteOneFieldInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "CreateViewGroupInput": {
            "id": [
                3
            ],
            "isVisible": [
                6
            ],
            "fieldValue": [
                1
            ],
            "position": [
                11
            ],
            "viewId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewGroupInput": {
            "id": [
                3
            ],
            "update": [
                475
            ],
            "__typename": [
                1
            ]
        },
        "UpdateViewGroupInputUpdates": {
            "fieldMetadataId": [
                3
            ],
            "isVisible": [
                6
            ],
            "fieldValue": [
                1
            ],
            "position": [
                11
            ],
            "__typename": [
                1
            ]
        },
        "DeleteViewGroupInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "DestroyViewGroupInput": {
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "UpdateMessageFolderInput": {
            "id": [
                3
            ],
            "update": [
                479
            ],
            "__typename": [
                1
            ]
        },
        "UpdateMessageFolderInputUpdates": {
            "isSynced": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpdateMessageFoldersInput": {
            "ids": [
                3
            ],
            "update": [
                479
            ],
            "__typename": [
                1
            ]
        },
        "UpdateMessageChannelInput": {
            "id": [
                3
            ],
            "update": [
                482
            ],
            "__typename": [
                1
            ]
        },
        "UpdateMessageChannelInputUpdates": {
            "visibility": [
                341
            ],
            "isContactAutoCreationEnabled": [
                6
            ],
            "contactAutoCreationPolicy": [
                343
            ],
            "messageFolderImportPolicy": [
                344
            ],
            "isSyncEnabled": [
                6
            ],
            "excludeNonProfessionalEmails": [
                6
            ],
            "excludeGroupEmails": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpdateCalendarChannelInput": {
            "id": [
                3
            ],
            "update": [
                484
            ],
            "__typename": [
                1
            ]
        },
        "UpdateCalendarChannelInputUpdates": {
            "visibility": [
                338
            ],
            "isContactAutoCreationEnabled": [
                6
            ],
            "contactAutoCreationPolicy": [
                339
            ],
            "isSyncEnabled": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "CreateWebhookInput": {
            "id": [
                3
            ],
            "targetUrl": [
                1
            ],
            "operations": [
                1
            ],
            "description": [
                1
            ],
            "secret": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UpdateWebhookInput": {
            "id": [
                3
            ],
            "update": [
                487
            ],
            "__typename": [
                1
            ]
        },
        "UpdateWebhookInputUpdates": {
            "targetUrl": [
                1
            ],
            "operations": [
                1
            ],
            "description": [
                1
            ],
            "secret": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateSkillInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "description": [
                1
            ],
            "content": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UpdateSkillInput": {
            "id": [
                3
            ],
            "name": [
                1
            ],
            "label": [
                1
            ],
            "icon": [
                1
            ],
            "description": [
                1
            ],
            "content": [
                1
            ],
            "isActive": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "GetAuthorizationUrlForSSOInput": {
            "identityProviderId": [
                3
            ],
            "workspaceInviteHash": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "CreateApplicationRegistrationInput": {
            "name": [
                1
            ],
            "universalIdentifier": [
                1
            ],
            "oAuthRedirectUris": [
                1
            ],
            "oAuthScopes": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UpdateApplicationRegistrationInput": {
            "id": [
                1
            ],
            "update": [
                493
            ],
            "__typename": [
                1
            ]
        },
        "UpdateApplicationRegistrationPayload": {
            "name": [
                1
            ],
            "oAuthRedirectUris": [
                1
            ],
            "oAuthScopes": [
                1
            ],
            "isListed": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "CreateApplicationRegistrationVariableInput": {
            "applicationRegistrationId": [
                1
            ],
            "key": [
                1
            ],
            "value": [
                1
            ],
            "description": [
                1
            ],
            "isSecret": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpdateApplicationRegistrationVariableInput": {
            "id": [
                1
            ],
            "update": [
                496
            ],
            "__typename": [
                1
            ]
        },
        "UpdateApplicationRegistrationVariablePayload": {
            "value": [
                1
            ],
            "description": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ActivateWorkspaceInput": {
            "displayName": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UpdateWorkspaceInput": {
            "subdomain": [
                1
            ],
            "customDomain": [
                1
            ],
            "displayName": [
                1
            ],
            "logo": [
                1
            ],
            "inviteHash": [
                1
            ],
            "isPublicInviteLinkEnabled": [
                6
            ],
            "allowImpersonation": [
                6
            ],
            "isGoogleAuthEnabled": [
                6
            ],
            "isMicrosoftAuthEnabled": [
                6
            ],
            "isPasswordAuthEnabled": [
                6
            ],
            "isGoogleAuthBypassEnabled": [
                6
            ],
            "isMicrosoftAuthBypassEnabled": [
                6
            ],
            "isPasswordAuthBypassEnabled": [
                6
            ],
            "defaultRoleId": [
                3
            ],
            "isTwoFactorAuthenticationEnforced": [
                6
            ],
            "trashRetentionDays": [
                11
            ],
            "eventLogRetentionDays": [
                11
            ],
            "fastModel": [
                1
            ],
            "smartModel": [
                1
            ],
            "aiAdditionalInstructions": [
                1
            ],
            "editableProfileFields": [
                1
            ],
            "enabledAiModelIds": [
                1
            ],
            "useRecommendedModels": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "SetupOIDCSsoInput": {
            "name": [
                1
            ],
            "issuer": [
                1
            ],
            "clientID": [
                1
            ],
            "clientSecret": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "SetupSAMLSsoInput": {
            "name": [
                1
            ],
            "issuer": [
                1
            ],
            "id": [
                3
            ],
            "ssoURL": [
                1
            ],
            "certificate": [
                1
            ],
            "fingerprint": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "DeleteSsoInput": {
            "identityProviderId": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "EditSsoInput": {
            "id": [
                3
            ],
            "status": [
                164
            ],
            "__typename": [
                1
            ]
        },
        "SendEmailInput": {
            "connectedAccountId": [
                1
            ],
            "to": [
                1
            ],
            "cc": [
                1
            ],
            "bcc": [
                1
            ],
            "subject": [
                1
            ],
            "body": [
                1
            ],
            "inReplyTo": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "EmailAccountConnectionParameters": {
            "IMAP": [
                505
            ],
            "SMTP": [
                505
            ],
            "CALDAV": [
                505
            ],
            "__typename": [
                1
            ]
        },
        "ConnectionParameters": {
            "host": [
                1
            ],
            "port": [
                11
            ],
            "username": [
                1
            ],
            "password": [
                1
            ],
            "secure": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "UpdateLabPublicFeatureFlagInput": {
            "publicFeatureFlag": [
                1
            ],
            "value": [
                6
            ],
            "__typename": [
                1
            ]
        },
        "AiModelRole": {},
        "CreateOneAppTokenInput": {
            "appToken": [
                509
            ],
            "__typename": [
                1
            ]
        },
        "CreateAppTokenInput": {
            "expiresAt": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceMigrationInput": {
            "actions": [
                511
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceMigrationDeleteActionInput": {
            "type": [
                512
            ],
            "metadataName": [
                351
            ],
            "universalIdentifier": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "WorkspaceMigrationActionType": {},
        "FileFolder": {},
        "Subscription": {
            "onEventSubscription": [
                157,
                {
                    "eventStreamId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "logicFunctionLogs": [
                256,
                {
                    "input": [
                        515,
                        "LogicFunctionLogsInput!"
                    ]
                }
            ],
            "onAgentChatEvent": [
                330,
                {
                    "threadId": [
                        3,
                        "UUID!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "LogicFunctionLogsInput": {
            "applicationId": [
                3
            ],
            "applicationUniversalIdentifier": [
                3
            ],
            "name": [
                1
            ],
            "id": [
                3
            ],
            "universalIdentifier": [
                3
            ],
            "__typename": [
                1
            ]
        }
    }
}