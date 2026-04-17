/**
 * Important notice:
 * - Never ever mutate an existing universal identifier
 * - Deleting an existing unniversal identifier should be very rare
 */

export const STANDARD_OBJECTS = {
  attachment: {
    universalIdentifier: '20202020-bd3d-4c60-8dca-571c71d4447a',
    fields: {
      id: { universalIdentifier: '20202020-a01a-4001-8a01-1d5f8e3c7b2a' },
      createdAt: {
        universalIdentifier: '20202020-a01b-4002-9b02-2e6f9f4d8c3b',
      },
      updatedAt: {
        universalIdentifier: '20202020-a01c-4003-8c03-3f7fa05d9d4c',
      },
      deletedAt: {
        universalIdentifier: '20202020-a01d-4004-9d04-4f8fb16eae5d',
      },
      name: { universalIdentifier: '20202020-87a5-48f8-bbf7-ade388825a57' },
      file: { universalIdentifier: '20202020-15db-460e-8166-c7b5d87ad4be' },
      //deprecated
      fullPath: { universalIdentifier: '20202020-0d19-453d-8e8d-fbcda8ca3747' },
      //deprecated
      fileCategory: {
        universalIdentifier: '20202020-8c3f-4d9e-9a1b-2e5f7a8c9d0e',
      },
      createdBy: {
        universalIdentifier: '395be3bd-a5c9-463d-aafe-9bc3bbec3f15',
      },
      updatedBy: {
        universalIdentifier: '376239d1-3e65-4cb6-b5d8-e0917d43cc93',
      },
      targetTask: {
        universalIdentifier: '20202020-51e5-4621-9cf8-215487951c4b',
      },
      targetNote: {
        universalIdentifier: '20202020-4f4b-4503-a6fc-6b982f3dffb5',
      },
      targetPerson: {
        universalIdentifier: '20202020-0158-4aa2-965c-5cdafe21ffa2',
      },
      targetCompany: {
        universalIdentifier: '20202020-ceab-4a28-b546-73b06b4c08d5',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-7374-499d-bea3-9354890755b5',
      },
      targetDashboard: {
        universalIdentifier: '20202020-5324-43f3-9dbf-1a33e7de0ce6',
      },
      targetWorkflow: {
        universalIdentifier: '20202020-f1e8-4c9d-8a7b-3f5e1d2c9a8b',
      },
      targetCampaign: {
        universalIdentifier: 'e6ae17aa-8175-4170-8695-9a39d229c443',
      },
      targetTrackedDocument: {
        universalIdentifier: 'd9d65570-9222-439e-bbde-f9dd8eb698ae',
      },
      targetMeetingType: {
        universalIdentifier: '672a9ec2-2ea6-4311-879e-565bbdbc4882',
      },
      targetChatWidget: {
        universalIdentifier: '86639d57-12bb-463e-99b1-e3ee33ecd1bf',
      },
      targetSequence: {
        universalIdentifier: 'd027539a-edcc-4e6a-bd20-bda638747418',
      },
      targetQuote: {
        universalIdentifier: '7a451285-7f2c-4ffd-b1a4-9a0525aa53eb',
      },
      position: {
        universalIdentifier: 'cef8f62c-cd46-4444-8cbb-17d463b7464a',
      },
      searchVector: {
        universalIdentifier: 'e7b42835-cb2e-4456-8558-9225362aa52d',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-f634-435d-ab8d-e1168b375c69' },
    },
    indexes: {
      taskIdIndex: {
        universalIdentifier: 'b8d4f9a3-0c25-4e7b-9f6a-2d3e4c5b6f70',
      },
      noteIdIndex: {
        universalIdentifier: '9d31ea73-13b6-4e06-84ee-c66c72bf7787',
      },
      personIdIndex: {
        universalIdentifier: '55637a5a-1edc-4351-8d76-d40020bf8944',
      },
      companyIdIndex: {
        universalIdentifier: '4137ba06-184d-438f-b484-080f02a97659',
      },
      opportunityIdIndex: {
        universalIdentifier: '8cc162d1-c127-4981-878d-f78622f8f12d',
      },
      dashboardIdIndex: {
        universalIdentifier: 'c10eba2d-ff1a-4eab-9285-50481c12a003',
      },
      workflowIdIndex: {
        universalIdentifier: 'fadeab4b-79ee-4173-af79-72c51fbad888',
      },
      campaignIdIndex: {
        universalIdentifier: 'f8562123-b374-4565-80c7-05d6318b7f4b',
      },
      trackedDocumentIdIndex: {
        universalIdentifier: '78d3b56f-5890-47c7-9864-808028f4a22c',
      },
      meetingTypeIdIndex: {
        universalIdentifier: 'cb28fc90-5896-4bba-9463-440c06eeaa6d',
      },
      chatWidgetIdIndex: {
        universalIdentifier: 'ecc843fa-e605-4091-b91b-f68db0f8ec9b',
      },
      sequenceIdIndex: {
        universalIdentifier: '182e7c9f-7c27-473e-be11-2feca4960f0b',
      },
      quoteIdIndex: {
        universalIdentifier: 'a7cd0581-ca28-4ef0-84bb-a11e2e06327d',
      },
    },
    views: {
      allAttachments: {
        universalIdentifier: '3f7f3363-7087-44cc-902d-5e8904262316',
        viewFields: {
          name: {
            universalIdentifier: 'be56712f-d7a6-4fbe-b92b-d750f0708a0a',
          },
          file: {
            universalIdentifier: '873cf114-5477-4b62-9023-7ea6ad69fbe5',
          },
          createdBy: {
            universalIdentifier: 'fa363372-0fdf-4bb3-bdf1-0ead354b9225',
          },
          createdAt: {
            universalIdentifier: '6c092c26-b1cb-488f-ae2e-5af4bec1162b',
          },
          targetPerson: {
            universalIdentifier: '73a4c3a7-c7f9-4ed6-a2b6-117d7efad0f3',
          },
          targetCompany: {
            universalIdentifier: 'b335ad04-059e-4c36-8666-f40431849044',
          },
          targetOpportunity: {
            universalIdentifier: '15f2d457-dc09-4c52-bf2a-47083d6bf017',
          },
          targetTask: {
            universalIdentifier: 'c2913c5e-6cc6-438d-9c2f-3212a9b2a82b',
          },
          targetNote: {
            universalIdentifier: 'fc8dba49-bcf2-41b8-a435-0c4a3bbf2af6',
          },
          targetDashboard: {
            universalIdentifier: 'bcc6d6e1-7c0b-4291-9270-66e42024d8dd',
          },
          targetWorkflow: {
            universalIdentifier: '11fcf58b-dbab-42dd-be67-689462111070',
          },
        },
      },
    },
  },
  blocklist: {
    universalIdentifier: '20202020-0408-4f38-b8a8-4d5e3e26e24d',
    fields: {
      id: { universalIdentifier: '20202020-b01a-4011-8b11-5a9fc27fbf6e' },
      createdAt: {
        universalIdentifier: '20202020-b01b-4012-9c12-6bafd38fcf7f',
      },
      updatedAt: {
        universalIdentifier: '20202020-b01c-4013-8d13-7cbfe49fdf8f',
      },
      deletedAt: {
        universalIdentifier: '20202020-b01d-4014-9e14-8dcff5affef9',
      },
      handle: { universalIdentifier: '20202020-eef3-44ed-aa32-4641d7fd4a3e' },
      workspaceMember: {
        universalIdentifier: '20202020-548d-4084-a947-fa20a39f7c06',
      },
      createdBy: {
        universalIdentifier: 'b80db15d-8dc2-4f47-a072-15030941a9d1',
      },
      updatedBy: {
        universalIdentifier: '11aaa404-f04b-421d-a451-c453bf77cc78',
      },
      position: {
        universalIdentifier: '72a27e60-3542-46dc-90db-684d79bd7f11',
      },
      searchVector: {
        universalIdentifier: '5fa758da-30b4-412e-8a4f-975f2848ce60',
      },
    },
    indexes: {
      workspaceMemberIdIndex: {
        universalIdentifier: '4daf320e-74d0-4f24-a45a-af3a09d741cb',
      },
    },
    views: {
      allBlocklists: {
        universalIdentifier: '5a98e88c-67c2-4f61-a5ab-a0d3d6a836bb',
        viewFields: {
          handle: {
            universalIdentifier: '155ae00d-0def-4f62-9473-8a8efa209eee',
          },
          workspaceMember: {
            universalIdentifier: '05a2f0b9-f2ef-4729-bc42-9e2ad2a34fb2',
          },
          createdAt: {
            universalIdentifier: 'e7cfcf05-2676-4d43-9eee-4da1016b12ff',
          },
        },
      },
      blocklistRecordPageFields: {
        universalIdentifier: '5c679d04-7a1c-41be-9429-c9317ac7a0ea',
        viewFieldGroups: {
          general: {
            universalIdentifier: '94009e34-52fb-4534-89ce-6c6d0a774056',
          },
          other: {
            universalIdentifier: '35dace44-6e63-4cdb-b761-a92bcf126a7e',
          },
        },
        viewFields: {
          workspaceMember: {
            universalIdentifier: 'f2f5732f-7435-44be-986b-4c4d834fdfeb',
          },
          createdAt: {
            universalIdentifier: 'b2594a03-e00f-4de9-89da-b34bb95c2221',
          },
          createdBy: {
            universalIdentifier: '80a60507-6c7a-4713-b5de-b94ac293bf23',
          },
        },
      },
    },
  },
  calendarChannelEventAssociation: {
    universalIdentifier: '20202020-491b-4aaa-9825-afd1bae6ae00',
    fields: {
      id: {
        universalIdentifier: '20202020-c01a-4021-8a21-9edf06bfef0a',
      },
      createdAt: {
        universalIdentifier: '20202020-c01b-4022-9b22-afefd7cffefb',
      },
      updatedAt: {
        universalIdentifier: '20202020-c01c-4023-8c23-bffef8dffef0',
      },
      deletedAt: {
        universalIdentifier: '20202020-c01d-4024-9d24-cffef9effef1',
      },
      calendarChannelId: {
        universalIdentifier: '20202020-93ee-4da4-8d58-0282c4a9cb7d',
      },
      calendarEvent: {
        universalIdentifier: '20202020-5aa5-437e-bb86-f42d457783e3',
      },
      eventExternalId: {
        universalIdentifier: '20202020-9ec8-48bb-b279-21d0734a75a1',
      },
      recurringEventExternalId: {
        universalIdentifier: '20202020-c58f-4c69-9bf8-9518fa31aa50',
      },
      createdBy: {
        universalIdentifier: '8daa2bc8-bce2-4309-8a48-b929f3ee2c34',
      },
      updatedBy: {
        universalIdentifier: '55d810d2-fe47-44b4-b1de-b9c32113b695',
      },
      position: {
        universalIdentifier: '4fa18346-bb2b-49b0-ab35-23df86eed1c8',
      },
      searchVector: {
        universalIdentifier: '1844a9cf-6d35-46d7-99ba-011626a6d71b',
      },
    },
    indexes: {
      calendarChannelIdIndex: {
        universalIdentifier: 'ff6b86c1-3112-4dfa-b734-c4789111a716',
      },
      calendarEventIdIndex: {
        universalIdentifier: '47a3c8d2-9f14-4b6e-8c5d-1a2b3f4e5c69',
      },
    },
    views: {
      allCalendarChannelEventAssociations: {
        universalIdentifier: '001893be-c06c-4ba1-9f18-53bd26f0179f',
        viewFields: {
          calendarChannelId: {
            universalIdentifier: 'e3adffd2-d820-4c89-912c-34908d90057e',
          },
          calendarEvent: {
            universalIdentifier: '35656a84-ecb8-4075-a610-8b538d6f8120',
          },
          eventExternalId: {
            universalIdentifier: 'f779d7e8-f1d8-44a7-b0ef-4409c9b6b466',
          },
          createdAt: {
            universalIdentifier: '8ca74f2f-210b-4afc-81f0-506047400e82',
          },
        },
      },
      calendarChannelEventAssociationRecordPageFields: {
        universalIdentifier: '766f254a-a0eb-45c8-b4d2-12311201e08f',
        viewFieldGroups: {
          general: {
            universalIdentifier: '9c27f771-9f85-492f-b1f1-9bc7a175f6f3',
          },
          other: {
            universalIdentifier: 'c7b18e05-dd60-4ee4-911a-290790e8c425',
          },
        },
        viewFields: {
          calendarChannelId: {
            universalIdentifier: 'cd6c6714-fc1d-4511-a664-ec5e8dfd8692',
          },
          calendarEvent: {
            universalIdentifier: '4790ca84-255e-4cb7-9b20-c17f4d94df8e',
          },
          eventExternalId: {
            universalIdentifier: 'dbe16c1b-ece2-4d2f-b634-094742ac3e16',
          },
          createdAt: {
            universalIdentifier: '2702ae80-9108-4757-8a25-317a4357484e',
          },
          createdBy: {
            universalIdentifier: '201e0c45-fddc-4217-bfd4-40c13d7f7916',
          },
        },
      },
    },
  },
  calendarChannel: {
    universalIdentifier: '20202020-e8f2-40e1-a39c-c0e0039c5034',
    fields: {
      id: { universalIdentifier: '20202020-c02a-4031-8a31-1a2f3b4c5d6e' },
      createdAt: {
        universalIdentifier: '20202020-c02b-4032-9b32-2b3f4c5d6e7f',
      },
      updatedAt: {
        universalIdentifier: '20202020-c02c-4033-8c33-3c4f5d6e7f8a',
      },
      deletedAt: {
        universalIdentifier: '20202020-c02d-4034-9d34-4d5f6e7f8a9b',
      },
      connectedAccount: {
        universalIdentifier: '20202020-95b1-4f44-82dc-61b042ae2414',
      },
      handle: {
        universalIdentifier: '20202020-1d08-420a-9aa7-22e0f298232d',
      },
      visibility: {
        universalIdentifier: '20202020-1b07-4796-9f01-d626bab7ca4d',
      },
      isContactAutoCreationEnabled: {
        universalIdentifier: '20202020-50fb-404b-ba28-369911a3793a',
      },
      contactAutoCreationPolicy: {
        universalIdentifier: '20202020-b55d-447d-b4df-226319058775',
      },
      isSyncEnabled: {
        universalIdentifier: '20202020-fe19-4818-8854-21f7b1b43395',
      },
      syncCursor: {
        universalIdentifier: '20202020-bac2-4852-a5cb-7a7898992b70',
      },
      throttleFailureCount: {
        universalIdentifier: '20202020-525c-4b76-b9bd-0dd57fd11d61',
      },
      syncStatus: {
        universalIdentifier: '20202020-7116-41da-8b4b-035975c4eb6a',
      },
      syncStage: {
        universalIdentifier: '20202020-6246-42e6-b5cd-003bd921782c',
      },
      syncStageStartedAt: {
        universalIdentifier: '20202020-a934-46f1-a8e7-9568b1e3a53e',
      },
      syncedAt: {
        universalIdentifier: '20202020-2ff5-4f70-953a-3d0d36357576',
      },
      createdBy: {
        universalIdentifier: '664db1a0-76f4-4429-8452-f8e250ab7545',
      },
      updatedBy: {
        universalIdentifier: '6a397eab-3700-4b08-9eb9-d16b61876193',
      },
      position: {
        universalIdentifier: '566609c9-1c8b-4899-91bb-0af140a89004',
      },
      searchVector: {
        universalIdentifier: 'bc9a982c-c314-49d6-818a-2661ce7e918f',
      },
    },
    indexes: {
      connectedAccountIdIndex: {
        universalIdentifier: '58b4d9e3-0a25-4c7f-9d6e-2b3c4a5f6d70',
      },
    },
    views: {
      allCalendarChannels: {
        universalIdentifier: '2d11659c-68ae-4ff2-882f-f1cccde372d0',
        viewFields: {
          handle: {
            universalIdentifier: 'dc7ea888-79d6-4b8c-acdd-a72abe8e6326',
          },
          connectedAccount: {
            universalIdentifier: '0fff693f-2149-4fdb-a85c-52f2d89322f2',
          },
          visibility: {
            universalIdentifier: 'a308409d-ee09-4588-b3b2-31b71bced64d',
          },
          isSyncEnabled: {
            universalIdentifier: '120065b8-bcba-4088-b3a8-8ae66def4219',
          },
          syncStatus: {
            universalIdentifier: 'ee3bafb8-6374-44f3-b328-c705c16220ac',
          },
          createdAt: {
            universalIdentifier: 'b2ef299a-b996-4f44-8c75-fad854d7df7f',
          },
        },
      },
      calendarChannelRecordPageFields: {
        universalIdentifier: '74813eac-7b7e-4483-9d2c-6e14cdc2eeee',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'e015afb4-bb6b-44ab-8077-01196c70bd1b',
          },
          other: {
            universalIdentifier: 'a7e61a73-68b3-46a2-8624-54a4f0a81710',
          },
        },
        viewFields: {
          connectedAccount: {
            universalIdentifier: 'bdb40f41-f9ba-4b59-a8cf-878c23701ab3',
          },
          visibility: {
            universalIdentifier: '2d9f8c64-12be-4bb1-b0d4-977d89853498',
          },
          isSyncEnabled: {
            universalIdentifier: '819312c0-3441-42a2-a638-8800e353b72f',
          },
          syncStatus: {
            universalIdentifier: 'b95949f7-e4f7-4708-bfd5-6ec66d772465',
          },
          createdAt: {
            universalIdentifier: '8c0e4a82-9846-46b2-988b-8b651395fc52',
          },
          createdBy: {
            universalIdentifier: '35af4126-06bd-43a1-88cb-b1e2a170ccd2',
          },
        },
      },
    },
  },
  calendarEventParticipant: {
    universalIdentifier: '20202020-a1c3-47a6-9732-27e5b1e8436d',
    fields: {
      id: {
        universalIdentifier: '20202020-c03a-4041-8a41-5e6f7a8b9cad',
      },
      createdAt: {
        universalIdentifier: '20202020-c03b-4042-9b42-6f7a8b9cadbe',
      },
      updatedAt: {
        universalIdentifier: '20202020-c03c-4043-8c43-7a8b9cadbecf',
      },
      deletedAt: {
        universalIdentifier: '20202020-c03d-4044-9d44-8b9cadbecd0f',
      },
      calendarEvent: {
        universalIdentifier: '20202020-fe3a-401c-b889-af4f4657a861',
      },
      handle: {
        universalIdentifier: '20202020-8692-4580-8210-9e09cbd031a7',
      },
      displayName: {
        universalIdentifier: '20202020-ee1e-4f9f-8ac1-5c0b2f69691e',
      },
      isOrganizer: {
        universalIdentifier: '20202020-66e7-4e00-9e06-d06c92650580',
      },
      responseStatus: {
        universalIdentifier: '20202020-cec0-4be8-8fba-c366abc23147',
      },
      person: {
        universalIdentifier: '20202020-5761-4842-8186-e1898ef93966',
      },
      workspaceMember: {
        universalIdentifier: '20202020-20e4-4591-93ed-aeb17a4dcbd2',
      },
      createdBy: {
        universalIdentifier: '9e9ec14d-b889-448e-afe5-40e407be11d1',
      },
      updatedBy: {
        universalIdentifier: 'a2c6efda-06bf-418e-808a-dac9fd64ab58',
      },
      position: {
        universalIdentifier: 'fcfa672c-ce6d-4fc1-b978-db58a4cc14f4',
      },
      searchVector: {
        universalIdentifier: 'c9dccf32-64ea-433e-a9a7-09993343bae0',
      },
    },
    indexes: {
      calendarEventIdIndex: {
        universalIdentifier: 'c458ad97-8b95-43de-9003-88eb68576049',
      },
      personIdIndex: {
        universalIdentifier: '30e9b75a-881f-4a85-aaf1-f2d2464be1cf',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: '898aa202-428f-4a7a-a3b3-8f0a17a6658e',
      },
    },
    views: {
      allCalendarEventParticipants: {
        universalIdentifier: '5228d634-6b69-4a43-be5c-e778fa6fe779',
        viewFields: {
          calendarEvent: {
            universalIdentifier: 'd9c2f346-b83b-48ae-98d0-e344f97248cd',
          },
          handle: {
            universalIdentifier: '4140bd68-55e8-475c-8724-7f9f97634a9f',
          },
          displayName: {
            universalIdentifier: '3cadc470-9231-4027-9bbe-60e934edb483',
          },
          isOrganizer: {
            universalIdentifier: '684972f9-c5fe-4fff-bdec-2fc5511c938c',
          },
          responseStatus: {
            universalIdentifier: 'dd0ab0bd-7f33-48fa-9461-fb5d085a2f9f',
          },
          person: {
            universalIdentifier: '86546244-9e3d-40e4-87cd-cbc82a353d2e',
          },
          workspaceMember: {
            universalIdentifier: '542141b0-ac85-4c43-867b-8d7f559b07ae',
          },
          createdAt: {
            universalIdentifier: '63d9d40d-e40c-410c-a14c-2f36c64c3e69',
          },
        },
      },
      calendarEventParticipantRecordPageFields: {
        universalIdentifier: 'e01ebdb3-8fb8-46d2-8230-82242d593f7a',
        viewFieldGroups: {
          general: {
            universalIdentifier: '3d842777-436e-467d-90ae-9e1fa0aa7e9c',
          },
          other: {
            universalIdentifier: '098836d8-15c1-44c1-a58e-2ff7fd6a05f9',
          },
        },
        viewFields: {
          calendarEvent: {
            universalIdentifier: '865a1278-c356-4b99-a5e9-1ca3d33c7665',
          },
          handle: {
            universalIdentifier: 'eb09af9c-b3f4-403c-8cb2-172243f83958',
          },
          displayName: {
            universalIdentifier: '23b97527-6ad3-4f07-bf68-559b97321673',
          },
          isOrganizer: {
            universalIdentifier: '3c126f3c-bd01-4029-b58a-724513fa5fff',
          },
          responseStatus: {
            universalIdentifier: 'cd02fc91-8fa4-4fa3-b0e3-1a1fc891e6ee',
          },
          person: {
            universalIdentifier: '46be729d-091c-4012-aeca-16a743008513',
          },
          workspaceMember: {
            universalIdentifier: 'c38c1111-f6e0-4698-9b36-db59f8d97de3',
          },
          createdAt: {
            universalIdentifier: '1447c7fa-fe2b-4ff7-8036-8de682537e23',
          },
          createdBy: {
            universalIdentifier: '6d7dff75-0230-45bd-8db9-dc25ef007e6e',
          },
        },
      },
    },
  },
  calendarEvent: {
    universalIdentifier: '20202020-8f1d-4eef-9f85-0d1965e27221',
    fields: {
      id: { universalIdentifier: '20202020-c04a-4051-8a51-9cadbe0f1e2d' },
      createdAt: {
        universalIdentifier: '20202020-c04b-4052-9b52-adbecf1f2e3e',
      },
      updatedAt: {
        universalIdentifier: '20202020-c04c-4053-8c53-becf0f2f3e4f',
      },
      deletedAt: {
        universalIdentifier: '20202020-c04d-4054-9d54-cd0f1f3f4e5f',
      },
      title: { universalIdentifier: '20202020-080e-49d1-b21d-9702a7e2525c' },
      isCanceled: {
        universalIdentifier: '20202020-335b-4e04-b470-43b84b64863c',
      },
      isFullDay: {
        universalIdentifier: '20202020-551c-402c-bb6d-dfe9efe86bcb',
      },
      startsAt: {
        universalIdentifier: '20202020-2c57-4c75-93c5-2ac950a6ed67',
      },
      endsAt: { universalIdentifier: '20202020-2554-4ee1-a617-17907f6bab21' },
      externalCreatedAt: {
        universalIdentifier: '20202020-9f03-4058-a898-346c62181599',
      },
      externalUpdatedAt: {
        universalIdentifier: '20202020-b355-4c18-8825-ef42c8a5a755',
      },
      description: {
        universalIdentifier: '20202020-52c4-4266-a98f-e90af0b4d271',
      },
      location: {
        universalIdentifier: '20202020-641a-4ffe-960d-c3c186d95b17',
      },
      iCalUid: {
        universalIdentifier: '20202020-f24b-45f4-b6a3-d2f9fcb98714',
      },
      conferenceSolution: {
        universalIdentifier: '20202020-1c3f-4b5a-b526-5411a82179eb',
      },
      conferenceLink: {
        universalIdentifier: '20202020-35da-43ef-9ca0-e936e9dc237b',
      },
      calendarChannelEventAssociations: {
        universalIdentifier: '20202020-bdf8-4572-a2cc-ecbb6bcc3a02',
      },
      calendarEventParticipants: {
        universalIdentifier: '20202020-e07e-4ccb-88f5-6f3d00458eec',
      },
      createdBy: {
        universalIdentifier: '664a9500-2641-4caa-8d95-069807bb2eb4',
      },
      updatedBy: {
        universalIdentifier: '1081c196-d675-4801-b9e1-7d8637b48eab',
      },
      position: {
        universalIdentifier: 'e9488e9a-0abe-4500-8c1d-bfbd6b8cffad',
      },
      searchVector: {
        universalIdentifier: 'b9e7825c-d491-4414-b904-910c00b5b93b',
      },
    },
    indexes: {},
    views: {
      allCalendarEvents: {
        universalIdentifier: '20202020-c001-4c01-8c01-ca1ebe0ca001',
        viewFields: {
          title: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf01',
          },
          startsAt: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf02',
          },
          endsAt: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf03',
          },
          isFullDay: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf04',
          },
          location: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf05',
          },
          conferenceLink: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf06',
          },
          isCanceled: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf07',
          },
          createdAt: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf08',
          },
        },
      },
    },
  },
  company: {
    universalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
    fields: {
      id: { universalIdentifier: '20202020-c05a-4061-8a61-1e2f3a4b5c6d' },
      createdAt: {
        universalIdentifier: '20202020-c05b-4062-9b62-2f3a4b5c6d7e',
      },
      updatedAt: {
        universalIdentifier: '20202020-c05c-4063-8c63-3a4b5c6d7e8f',
      },
      deletedAt: {
        universalIdentifier: '20202020-c05d-4064-9d64-4b5c6d7e8f9a',
      },
      name: { universalIdentifier: '20202020-4d99-4e2e-a84c-4a27837b1ece' },
      domainName: {
        universalIdentifier: '20202020-0c28-43d8-8ba5-3659924d3489',
      },
      address: { universalIdentifier: '20202020-c5ce-4adc-b7b6-9c0979fc55e7' },
      employees: {
        universalIdentifier: '20202020-8965-464a-8a75-74bafc152a0b',
      },
      linkedinLink: {
        universalIdentifier: '20202020-ebeb-4beb-b9ad-6848036fb451',
      },
      xLink: { universalIdentifier: '20202020-6f64-4fd9-9580-9c1991c7d8c3' },
      annualRecurringRevenue: {
        universalIdentifier: '20202020-602a-495c-9776-f5d5b11d227b',
      },
      idealCustomerProfile: {
        universalIdentifier: '20202020-ba6b-438a-8213-2c5ba28d76a2',
      },
      position: { universalIdentifier: '20202020-9b4e-462b-991d-a0ee33326454' },
      createdBy: {
        universalIdentifier: '20202020-fabc-451d-ab7d-412170916baa',
      },
      updatedBy: {
        universalIdentifier: '7444022e-b38f-4d4f-801b-cd664abc4834',
      },
      people: { universalIdentifier: '20202020-3213-4ddf-9494-6422bcff8d7c' },
      accountOwner: {
        universalIdentifier: '20202020-95b8-4e10-9881-edb5d4765f9d',
      },
      taskTargets: {
        universalIdentifier: '20202020-cb17-4a61-8f8f-3be6730480de',
      },
      noteTargets: {
        universalIdentifier: '20202020-bae0-4556-a74a-a9c686f77a88',
      },
      opportunities: {
        universalIdentifier: '20202020-add3-4658-8e23-d70dccb6d0ec',
      },
      favorites: {
        universalIdentifier: '20202020-4d1d-41ac-b13b-621631298d55',
      },
      attachments: {
        universalIdentifier: '20202020-c1b5-4120-b0f0-987ca401ed53',
      },
      timelineActivities: {
        universalIdentifier: '20202020-0414-4daf-9c0d-64fe7b27f89f',
      },
      quotes: {
        universalIdentifier: '10e0965b-2a47-4289-8eb3-0d318ee6bdce',
      },
      searchVector: {
        universalIdentifier: '85c71601-72f9-4b7b-b343-d46100b2c74d',
      },
    },
    indexes: {
      accountOwnerIdIndex: {
        universalIdentifier: 'ec2ebfc9-0c9b-4597-a87d-aa295e2d8bfe',
      },
      domainNameUniqueIndex: {
        universalIdentifier: 'dd300c61-f422-467a-91f4-de4f83c4175b',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'c3eb62df-2cc1-4cc3-b7aa-e96a4d65c633',
      },
    },
    views: {
      allCompanies: {
        universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c0001',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf001',
          },
          domainName: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf002',
          },
          createdBy: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf003',
          },
          accountOwner: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf004',
          },
          createdAt: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf005',
          },
          employees: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf006',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf007',
          },
          address: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf008',
          },
        },
      },
      companyRecordPageFields: {
        universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1101',
          },
          additional: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1102',
          },
          other: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1103',
          },
        },
        viewFields: {
          domainName: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1201',
          },
          accountOwner: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1202',
          },
          annualRecurringRevenue: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1203',
          },
          idealCustomerProfile: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1204',
          },
          employees: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1205',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1206',
          },
          xLink: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1207',
          },
          address: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1208',
          },
          createdAt: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1209',
          },
          createdBy: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1210',
          },
          updatedAt: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1212',
          },
          updatedBy: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1213',
          },
          people: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1214',
          },
          taskTargets: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1215',
          },
          noteTargets: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1216',
          },
          opportunities: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1217',
          },
          favorites: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1218',
          },
          attachments: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1219',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c121a',
          },
        },
      },
    },
  },
  connectedAccount: {
    universalIdentifier: '20202020-977e-46b2-890b-c3002ddfd5c5',
    fields: {
      id: { universalIdentifier: '20202020-c06a-4071-8a71-5c6d7e8f9aab' },
      createdAt: {
        universalIdentifier: '20202020-c06b-4072-9b72-6d7e8f9aabbc',
      },
      updatedAt: {
        universalIdentifier: '20202020-c06c-4073-8c73-7e8f9aabbccd',
      },
      deletedAt: {
        universalIdentifier: '20202020-c06d-4074-9d74-8f9aabbccdde',
      },
      handle: {
        universalIdentifier: '20202020-c804-4a50-bb05-b3a9e24f1dec',
      },
      provider: {
        universalIdentifier: '20202020-ebb0-4516-befc-a9e95935efd5',
      },
      accessToken: {
        universalIdentifier: '20202020-707b-4a0a-8753-2ad42efe1e29',
      },
      refreshToken: {
        universalIdentifier: '20202020-532d-48bd-80a5-c4be6e7f6e49',
      },
      accountOwner: {
        universalIdentifier: '20202020-3517-4896-afac-b1d0aa362af6',
      },
      lastSyncHistoryId: {
        universalIdentifier: '20202020-115c-4a87-b50f-ac4367a971b9',
      },
      authFailedAt: {
        universalIdentifier: '20202020-d268-4c6b-baff-400d402b430a',
      },
      lastCredentialsRefreshedAt: {
        universalIdentifier: '20202020-aa5e-4e85-903b-fdf90a941941',
      },
      messageChannels: {
        universalIdentifier: '20202020-24f7-4362-8468-042204d1e445',
      },
      calendarChannels: {
        universalIdentifier: '20202020-af4a-47bb-99ec-51911c1d3977',
      },
      handleAliases: {
        universalIdentifier: '20202020-8a3d-46be-814f-6228af16c47b',
      },
      scopes: {
        universalIdentifier: '20202020-8a3d-46be-814f-6228af16c47c',
      },
      connectionParameters: {
        universalIdentifier: '20202020-a1b2-46be-814f-6228af16c481',
      },
      createdBy: {
        universalIdentifier: 'e09c2463-9ca6-4004-97ce-6039e3161a5d',
      },
      updatedBy: {
        universalIdentifier: '0a84c0e1-f9fc-47d5-8ac9-58538e50a9f9',
      },
      position: {
        universalIdentifier: '66b7bc3e-c99e-42b6-82e6-6f43142c0f2f',
      },
      searchVector: {
        universalIdentifier: '140767fe-0aa4-4573-a0bd-67cb657c9452',
      },
    },
    indexes: {
      accountOwnerIdIndex: {
        universalIdentifier: '8e7ca28e-6002-4304-9dcc-0a8da93ca198',
      },
    },
    views: {
      allConnectedAccounts: {
        universalIdentifier: '0f47f1d8-63bf-443a-a29a-319ff4543abb',
        viewFields: {
          handle: {
            universalIdentifier: '84515ac3-6154-4860-8b29-10316ba3b6fb',
          },
          provider: {
            universalIdentifier: 'dde13525-685c-4476-adba-6d4fd3c92672',
          },
          accountOwner: {
            universalIdentifier: '7b5b84e1-8441-4c8c-a113-4fc184b24ba8',
          },
          authFailedAt: {
            universalIdentifier: '66c8d3d4-3505-46a4-85ec-8bad314aa257',
          },
          createdAt: {
            universalIdentifier: '8ff5aa14-69d3-4294-b266-d141d7e12dae',
          },
        },
      },
      connectedAccountRecordPageFields: {
        universalIdentifier: '1cc895ca-fe99-44bc-bc1e-19c935ef2595',
        viewFieldGroups: {
          general: {
            universalIdentifier: '428a9949-71f4-4ebf-9160-1da43f1113ff',
          },
          other: {
            universalIdentifier: 'ce9f7f72-583e-4415-a82f-e1f4b2cc8e2f',
          },
        },
        viewFields: {
          provider: {
            universalIdentifier: '83171d2a-0d11-42b1-991d-8d4346b02cff',
          },
          accountOwner: {
            universalIdentifier: '399a5e57-abab-42b1-b3f6-029a33d62e30',
          },
          authFailedAt: {
            universalIdentifier: 'ad52cc4e-fd75-4b11-8915-c8a7c96ce500',
          },
          createdAt: {
            universalIdentifier: 'eda84724-d30e-406d-9858-016dcd46ac49',
          },
          createdBy: {
            universalIdentifier: '1335696e-31cf-4a5e-aabf-89b45dd80b33',
          },
        },
      },
    },
  },
  dashboard: {
    universalIdentifier: '20202020-3840-4b6d-9425-0c5188b05ca8',
    fields: {
      id: { universalIdentifier: '20202020-da1a-41d1-8ad1-abcdefabcdef' },
      createdAt: {
        universalIdentifier: '20202020-da1b-41d2-9bd2-bcdefabcdefa',
      },
      updatedAt: {
        universalIdentifier: '20202020-da1c-41d3-8cd3-cdefabcdefab',
      },
      deletedAt: {
        universalIdentifier: '20202020-da1d-41d4-9dd4-defabcdefabc',
      },
      title: { universalIdentifier: '20202020-20ee-4091-95dc-44b57eda3a89' },
      position: { universalIdentifier: '20202020-38af-409b-95f0-7f08aa5f420f' },
      pageLayoutId: {
        universalIdentifier: '20202020-bb53-4648-aa36-1d9d54e6f7f2',
      },
      createdBy: {
        universalIdentifier: '20202020-ff32-4fa1-b7ad-407cc6aa0734',
      },
      updatedBy: {
        universalIdentifier: '53ee42e7-f157-42b5-b278-a5fa9b378307',
      },
      timelineActivities: {
        universalIdentifier: '99c330c0-5b7d-4276-a764-aed84499dfb5',
      },
      favorites: {
        universalIdentifier: '20202020-f032-478f-88fa-6426ff6f1e4c',
      },
      attachments: {
        universalIdentifier: '20202020-bf6f-4220-8c55-2764f1175870',
      },
      searchVector: {
        universalIdentifier: '20202020-0bcc-47a4-8360-2e35a7133f7a',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: 'e69f71aa-de0f-4b70-845f-7a8369c47928',
      },
    },
    views: {
      allDashboards: {
        universalIdentifier: '20202020-a012-4a12-8a12-da5ab0b0a001',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af01',
          },
          createdBy: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af02',
          },
          createdAt: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af03',
          },
          updatedAt: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af04',
          },
        },
      },
    },
  },
  favorite: {
    universalIdentifier: '20202020-ab56-4e05-92a3-e2414a499860',
    fields: {
      id: { universalIdentifier: '20202020-f01a-4091-8a91-ddeeffaabbcc' },
      createdAt: {
        universalIdentifier: '20202020-f01b-4092-9b92-eeffaabbccdd',
      },
      updatedAt: {
        universalIdentifier: '20202020-f01c-4093-8c93-ffaabbccddee',
      },
      deletedAt: {
        universalIdentifier: '20202020-f01d-4094-9d94-aabbccddeeff',
      },
      position: { universalIdentifier: '20202020-dd26-42c6-8c3c-2a7598c204f6' },
      forWorkspaceMember: {
        universalIdentifier: '20202020-ce63-49cb-9676-fdc0c45892cd',
      },
      person: { universalIdentifier: '20202020-c428-4f40-b6f3-86091511c41c' },
      company: { universalIdentifier: '20202020-cff5-4682-8bf9-069169e08279' },
      opportunity: {
        universalIdentifier: '20202020-dabc-48e1-8318-2781a2b32aa2',
      },
      workflow: { universalIdentifier: '20202020-b11b-4dc8-999a-6bd0a947b463' },
      workflowVersion: {
        universalIdentifier: '20202020-e1b8-4caf-b55a-3ab4d4cbcd21',
      },
      workflowRun: {
        universalIdentifier: '20202020-db5a-4fe4-9a13-9afa22b1e762',
      },
      task: { universalIdentifier: '20202020-1b1b-4b3b-8b1b-7f8d6a1d7d5c' },
      note: { universalIdentifier: '20202020-1f25-43fe-8b00-af212fdde824' },
      viewId: { universalIdentifier: '20202020-5a93-4fa9-acce-e73481a0bbdf' },
      favoriteFolder: {
        universalIdentifier: '20202020-f658-4d12-8b4d-248356aa4bd9',
      },
      dashboard: {
        universalIdentifier: '20202020-6ef9-45e4-b440-cc986f687c91',
      },
      createdBy: {
        universalIdentifier: '6440dc3d-fa50-49cc-abd3-98eeccd79288',
      },
      updatedBy: {
        universalIdentifier: '6c117b1a-0470-499b-8fcb-d9059eafbd43',
      },
      searchVector: {
        universalIdentifier: 'cbb27ea1-5cf8-4fed-9e0a-e4152815bd6e',
      },
    },
    indexes: {
      forWorkspaceMemberIdIndex: {
        universalIdentifier: 'e7e3a8b2-9d14-4f6c-8a5b-1e2f3d4c5669',
      },
      personIdIndex: {
        universalIdentifier: 'f8f4b9c3-0e25-4a7d-9b6c-2f3a4e5d677a',
      },
      companyIdIndex: {
        universalIdentifier: '1f360393-a336-435d-966d-8ec2645f875c',
      },
      favoriteFolderIdIndex: {
        universalIdentifier: 'c0369a13-49bd-48b0-a9f0-6ed0ee8e1b09',
      },
      opportunityIdIndex: {
        universalIdentifier: 'b8e9f696-5be4-48cb-815c-7c0bb8b69d38',
      },
      workflowIdIndex: {
        universalIdentifier: 'd4f3ef9f-ae24-4cef-9d7a-684a24d4968b',
      },
      workflowVersionIdIndex: {
        universalIdentifier: 'a257158e-3a89-4715-970c-7fc38ac22370',
      },
      workflowRunIdIndex: {
        universalIdentifier: 'd55711a3-3297-4fef-beab-48d733712a33',
      },
      taskIdIndex: {
        universalIdentifier: 'f30c9a75-a563-45a2-93b8-84f59004de8f',
      },
      noteIdIndex: {
        universalIdentifier: 'dca73027-adbe-4078-ae47-8d17850b9f2b',
      },
      dashboardIdIndex: {
        universalIdentifier: '8783e8f2-9114-4d6a-8e5f-12c3d1465673',
      },
    },
    views: {
      allFavorites: {
        universalIdentifier: '586ea330-3a17-434b-a23d-47185fa32230',
        viewFields: {
          forWorkspaceMember: {
            universalIdentifier: '70beb16f-f32b-4fb5-9795-fc83a120f7e9',
          },
          person: {
            universalIdentifier: '23cf916b-f55f-4edd-92b2-4eb38da0f451',
          },
          company: {
            universalIdentifier: '571a181e-3fd7-415e-a881-ec8acc65409e',
          },
          opportunity: {
            universalIdentifier: 'e882556d-1b29-4279-88ba-eab09f7590b9',
          },
          task: {
            universalIdentifier: '0124e873-f72e-4bc2-8158-efd8efa02432',
          },
          note: {
            universalIdentifier: '64210056-52d1-47fa-a771-a2c00846e170',
          },
          dashboard: {
            universalIdentifier: 'a12eff80-5272-4ce0-a1ae-30cc1cbbdcd7',
          },
          favoriteFolder: {
            universalIdentifier: '0113c292-24fe-4b8c-bb6f-94ae33bc12b9',
          },
          createdAt: {
            universalIdentifier: '48af76a4-e007-4644-be39-1ae9649f182f',
          },
        },
      },
      favoriteRecordPageFields: {
        universalIdentifier: 'e28089fc-639b-4eb2-bc9b-3ec8634d2813',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'd08267ae-eb74-4ed5-884e-4015d16d962d',
          },
          other: {
            universalIdentifier: 'bbbca990-4876-4802-bf7e-94f685bd5f52',
          },
        },
        viewFields: {
          forWorkspaceMember: {
            universalIdentifier: '16d2ec80-722e-4cbb-b053-404dd3bbb9dd',
          },
          person: {
            universalIdentifier: '0aa610ca-3825-4241-9a56-ec415fecf037',
          },
          company: {
            universalIdentifier: 'f09b8fd8-eded-4a64-bd62-6400c810337a',
          },
          opportunity: {
            universalIdentifier: '9880a34a-4186-40c8-94ac-161ed776b5b4',
          },
          task: {
            universalIdentifier: '4c0db772-05f8-41e7-801e-5a0224bed0b8',
          },
          note: {
            universalIdentifier: '966ab999-733d-49cd-80f2-7bb29118eecf',
          },
          dashboard: {
            universalIdentifier: '0bede669-3b98-4895-92be-39a1972cc106',
          },
          favoriteFolder: {
            universalIdentifier: '9af984ed-66fb-46ee-9edc-ad84d5680152',
          },
          createdAt: {
            universalIdentifier: '93addcc1-b42e-4fc1-be0f-51440ab9e3a1',
          },
          createdBy: {
            universalIdentifier: 'eca3262e-1082-413a-a601-a45563f69739',
          },
        },
      },
    },
  },
  favoriteFolder: {
    universalIdentifier: '20202020-7cf8-401f-8211-a9587d27fd2d',
    fields: {
      id: { universalIdentifier: '20202020-f02a-40a1-8aa1-1f2e3d4c5b6a' },
      createdAt: {
        universalIdentifier: '20202020-f02b-40a2-9ba2-2f3e4d5c6b7a',
      },
      updatedAt: {
        universalIdentifier: '20202020-f02c-40a3-8ca3-3f4e5d6c7b8a',
      },
      deletedAt: {
        universalIdentifier: '20202020-f02d-40a4-9da4-4f5e6d7c8b9a',
      },
      position: {
        universalIdentifier: '20202020-5278-4bde-8909-2cec74d43744',
      },
      name: { universalIdentifier: '20202020-82a3-4537-8ff0-dbce7eec35d6' },
      favorites: {
        universalIdentifier: '20202020-b5e3-4b42-8af2-03cd4fd2e4d2',
      },
      createdBy: {
        universalIdentifier: '1ec58922-7789-4832-a583-ec97f766f433',
      },
      updatedBy: {
        universalIdentifier: '6a53edc6-0ef2-4c35-9065-f91c4ddf7f01',
      },
      searchVector: {
        universalIdentifier: 'c5bb12e1-0cc3-428f-89f0-4c8747239ac3',
      },
    },
    indexes: {},
    views: {
      allFavoriteFolders: {
        universalIdentifier: '2420eb1f-09d0-4127-a71c-8a0ab3e1f6a0',
        viewFields: {
          name: {
            universalIdentifier: 'd5b0115f-ca6f-42d4-aac6-dcefaee2f19c',
          },
          createdAt: {
            universalIdentifier: '64ba591d-6091-4814-9af3-e28ce47278a0',
          },
        },
      },
      favoriteFolderRecordPageFields: {
        universalIdentifier: '09a2b4b4-0c84-41e5-932e-50f9b9b6c893',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'c0af3a9b-38bc-4c19-a79d-910f35d6f766',
          },
          other: {
            universalIdentifier: 'a7db50c7-826a-41ed-a252-1a07d445b025',
          },
        },
        viewFields: {
          createdAt: {
            universalIdentifier: 'a4e42591-844c-47d1-b72e-5ded3d541694',
          },
          createdBy: {
            universalIdentifier: '9f7945c9-fb98-49a7-812d-b87458149fd2',
          },
        },
      },
    },
  },
  messageChannelMessageAssociation: {
    universalIdentifier: '20202020-ad1e-4127-bccb-d83ae04d2ccb',
    fields: {
      id: {
        universalIdentifier: '20202020-b01a-40b1-8ab1-5a6b7c8d9eaf',
      },
      createdAt: {
        universalIdentifier: '20202020-b01b-40b2-9bb2-6b7c8d9eafba',
      },
      updatedAt: {
        universalIdentifier: '20202020-b01c-40b3-8cb3-7c8d9eafbacb',
      },
      deletedAt: {
        universalIdentifier: '20202020-b01d-40b4-9db4-8d9eafbacbdc',
      },
      messageChannelId: {
        universalIdentifier: '20202020-b658-408f-bd46-3bd2d15d7e52',
      },
      message: {
        universalIdentifier: '20202020-da5d-4ac5-8743-342ab0a0336b',
      },
      messageExternalId: {
        universalIdentifier: '20202020-37d6-438f-b6fd-6503596c8f34',
      },
      messageThread: {
        universalIdentifier: '20202020-fac8-42a8-94dd-44dbc920ae16',
      },
      messageThreadExternalId: {
        universalIdentifier: '20202020-35fb-421e-afa0-0b8e8f7f9018',
      },
      direction: {
        universalIdentifier: '75c9b0f7-9e76-44d4-a2f9-47051e61eec7',
      },
      createdBy: {
        universalIdentifier: 'ce7dc96f-dd33-4bce-9505-cbd381440cec',
      },
      updatedBy: {
        universalIdentifier: '334d2ad6-4bc4-4b51-9c92-8ad57652475e',
      },
      position: {
        universalIdentifier: '45d1e083-90d6-4507-b68a-454a9dc3a540',
      },
      searchVector: {
        universalIdentifier: 'edddd409-d9f0-4b93-8e3f-37faef6a3387',
      },
      messageFolders: {
        universalIdentifier: '9bfc9da7-ae2d-44fd-9563-ede90c5d6222',
      },
    },
    indexes: {
      messageChannelIdIndex: {
        universalIdentifier: '9894f9a3-0225-4e7b-9f6a-23d4e2576784',
      },
      messageIdIndex: {
        universalIdentifier: '9bb24d40-60dd-4beb-8c64-a74e8c67f9ee',
      },
      messageChannelIdMessageIdUniqueIndex: {
        universalIdentifier: '1b86ece8-7ce3-4df3-8771-fd4b5d45b2f2',
      },
    },
    views: {
      allMessageChannelMessageAssociations: {
        universalIdentifier: 'a4f465ac-d5cb-4f24-93ac-7a24bafd398e',
        viewFields: {
          messageChannelId: {
            universalIdentifier: 'b86e652b-04ce-4089-9f71-e190eaf5b798',
          },
          message: {
            universalIdentifier: 'f9f2de0d-3db5-402b-a733-53be6a4667c8',
          },
          messageExternalId: {
            universalIdentifier: '7fb9801d-ca3d-4b2d-8d55-c922fcf7fefd',
          },
          direction: {
            universalIdentifier: 'ca38195e-985c-4880-85e0-26fa143c1ec7',
          },
          createdAt: {
            universalIdentifier: 'af239abd-2c55-4108-a9d8-b5a67f6ca2e2',
          },
        },
      },
      messageChannelMessageAssociationRecordPageFields: {
        universalIdentifier: '680b43e2-5d50-49d8-bbdd-2d208e7b7071',
        viewFieldGroups: {
          general: {
            universalIdentifier: '86d7066c-ba38-4f6a-996f-77345bedd549',
          },
          other: {
            universalIdentifier: '6044c58c-a63c-4f3f-a283-b8803553628f',
          },
        },
        viewFields: {
          messageChannelId: {
            universalIdentifier: '376c7685-9ebe-4c95-b820-424b1c2f264f',
          },
          message: {
            universalIdentifier: '166aa5a0-d825-40dc-be6d-e94b87edd56d',
          },
          messageExternalId: {
            universalIdentifier: '1910bd21-2472-4a83-b8cd-7de51bdd2675',
          },
          direction: {
            universalIdentifier: '9edfbd44-4624-4cf8-b81c-8e169b4e8281',
          },
          createdAt: {
            universalIdentifier: '8651c5c4-db87-427c-8a57-6a9f75c74976',
          },
          createdBy: {
            universalIdentifier: 'af4adf31-f698-4aad-9f29-71908924fc9a',
          },
        },
      },
    },
  },
  messageChannelMessageAssociationMessageFolder: {
    universalIdentifier: '20202020-a1b0-40b0-8ab0-5b6c7d8e9f0a',
    fields: {
      id: {
        universalIdentifier: '20202020-a1b2-40b1-8ab1-6b7c8d9e0f1a',
      },
      createdAt: {
        universalIdentifier: '20202020-a1b3-40b2-9bb2-7c8d9e0f1a2b',
      },
      updatedAt: {
        universalIdentifier: '20202020-a1b4-40b3-8cb3-8d9e0f1a2b3c',
      },
      deletedAt: {
        universalIdentifier: '20202020-a1b5-40b4-9db4-9e0f1a2b3c4d',
      },
      createdBy: {
        universalIdentifier: 'f882a070-3393-4197-8140-b5858c6f7284',
      },
      updatedBy: {
        universalIdentifier: '107d13dc-a8ff-493c-8d04-72688c68f8c1',
      },
      position: {
        universalIdentifier: '76fcf020-482a-4d6c-b7b1-ccd6410299fc',
      },
      searchVector: {
        universalIdentifier: '38633a97-0e88-44de-9903-b8c9e0f59a36',
      },
      messageChannelMessageAssociation: {
        universalIdentifier: '7411cfa3-4fd9-4b90-a636-940015fd7243',
      },
      messageFolderId: {
        universalIdentifier: 'b3369d31-3856-4a7a-b007-ee353918127c',
      },
    },
    indexes: {
      messageChannelMessageAssociationIdIndex: {
        universalIdentifier: '8e6038aa-1f79-4a84-87b5-f33caa172e98',
      },
      messageFolderIdIndex: {
        universalIdentifier: '905299c3-ca81-435d-901c-f68b87562516',
      },
      messageChannelMessageAssociationIdMessageFolderIdUniqueIndex: {
        universalIdentifier: 'a3de1788-5dff-4849-ac5a-0dabe5fab216',
      },
    },
    views: {
      allMessageChannelMessageAssociationMessageFolders: {
        universalIdentifier: '775610fe-f1d1-4959-bdc3-0b437059cfeb',
        viewFields: {
          messageChannelMessageAssociation: {
            universalIdentifier: '1251e67a-e795-4bc2-a468-6cfc838b6a0a',
          },
          messageFolderId: {
            universalIdentifier: 'aff2203d-6439-43b8-9cb4-55e8d78bba43',
          },
          createdAt: {
            universalIdentifier: '9da7637e-25c7-4101-8169-b5f6ff159690',
          },
        },
      },
      messageChannelMessageAssociationMessageFolderRecordPageFields: {
        universalIdentifier: '331ec548-07d2-4f9d-a0a2-ef91a9f96184',
        viewFieldGroups: {
          general: {
            universalIdentifier: '4928521b-ae24-4013-a69a-1392017d57af',
          },
          other: {
            universalIdentifier: 'b76cebb3-39b2-477a-9212-8bf1190227a4',
          },
        },
        viewFields: {
          messageChannelMessageAssociation: {
            universalIdentifier: 'd34ed53e-5156-4a18-a8df-572269496aac',
          },
          messageFolderId: {
            universalIdentifier: '04f14582-caf9-49ee-81ea-e5d4f977bfe1',
          },
          createdAt: {
            universalIdentifier: '39297559-a747-481e-a4c5-b80b8faf1aac',
          },
          createdBy: {
            universalIdentifier: '4692eb91-7fc6-4436-9175-87caa5f6b668',
          },
        },
      },
    },
  },
  messageChannel: {
    universalIdentifier: '20202020-fe8c-40bc-a681-b80b771449b7',
    fields: {
      id: { universalIdentifier: '20202020-b02a-40c1-8ac1-9eafbacbdced' },
      createdAt: {
        universalIdentifier: '20202020-b02b-40c2-9bc2-afbacbdcedfe',
      },
      updatedAt: {
        universalIdentifier: '20202020-b02c-40c3-8cc3-bacbdcedfefa',
      },
      deletedAt: {
        universalIdentifier: '20202020-b02d-40c4-9dc4-cbdcedfefaab',
      },
      visibility: {
        universalIdentifier: '20202020-6a6b-4532-9767-cbc61b469453',
      },
      handle: {
        universalIdentifier: '20202020-2c96-43c3-93e3-ed6b1acb69bc',
      },
      connectedAccount: {
        universalIdentifier: '20202020-49a2-44a4-b470-282c0440d15d',
      },
      type: { universalIdentifier: '20202020-ae95-42d9-a3f1-797a2ea22122' },
      isContactAutoCreationEnabled: {
        universalIdentifier: '20202020-fabd-4f14-b7c6-3310f6d132c6',
      },
      contactAutoCreationPolicy: {
        universalIdentifier: '20202020-fc0e-4ba6-b259-a66ca89cfa38',
      },
      excludeNonProfessionalEmails: {
        universalIdentifier: '20202020-1df5-445d-b4f3-2413ad178431',
      },
      excludeGroupEmails: {
        universalIdentifier: '20202020-45a0-4be4-9164-5820a6a109fb',
      },
      messageFolderImportPolicy: {
        universalIdentifier: '20202020-cc39-4432-9fe8-ec8ab8bbed95',
      },
      pendingGroupEmailsAction: {
        universalIdentifier: '20202020-17c5-4e9f-bc50-af46a89fdd42',
      },
      isSyncEnabled: {
        universalIdentifier: '20202020-d9a6-48e9-990b-b97fdf22e8dd',
      },
      syncCursor: {
        universalIdentifier: '20202020-79d1-41cf-b738-bcf5ed61e256',
      },
      syncedAt: {
        universalIdentifier: '20202020-263d-4c6b-ad51-137ada56f7d4',
      },
      syncStatus: {
        universalIdentifier: '20202020-56a1-4f7e-9880-a8493bb899cc',
      },
      syncStage: {
        universalIdentifier: '20202020-7979-4b08-89fe-99cb5e698767',
      },
      syncStageStartedAt: {
        universalIdentifier: '20202020-8c61-4a42-ae63-73c1c3c52e06',
      },
      throttleFailureCount: {
        universalIdentifier: '20202020-0291-42be-9ad0-d578a51684ab',
      },
      throttleRetryAfter: {
        universalIdentifier: '20202020-a1e3-4d7f-b5c2-9f8e6d4c3b2a',
      },
      createdBy: {
        universalIdentifier: 'b7de8fcc-a7c6-4122-b3fa-1fcf8f30931c',
      },
      updatedBy: {
        universalIdentifier: '88bb6ff1-b8a1-4313-95d4-7879acca0b93',
      },
      position: {
        universalIdentifier: 'bc8a36af-8b9c-4548-a0da-c90e899e7243',
      },
      searchVector: {
        universalIdentifier: '5e84794c-6f14-4bdf-81a6-76ee11cda51f',
      },
    },
    indexes: {
      connectedAccountIdIndex: {
        universalIdentifier: 'ab09a386-4dcc-41f7-8dc6-a6071e9c64b7',
      },
    },
    views: {
      allMessageChannels: {
        universalIdentifier: '95f57f8e-eaac-46f7-b364-4ef8208f165f',
        viewFields: {
          handle: {
            universalIdentifier: 'f71a30b0-ee4a-4d36-847a-d0c99134fbb8',
          },
          connectedAccount: {
            universalIdentifier: '0128fd40-7958-4cc5-9c73-7ddb7820d3ec',
          },
          type: {
            universalIdentifier: 'fa480cec-938c-4216-95fe-ba4335e20a41',
          },
          visibility: {
            universalIdentifier: '2c43e4f6-7024-47a0-a91a-7d491b1fac84',
          },
          isSyncEnabled: {
            universalIdentifier: '69884c47-0c2e-4988-bbc1-23242993634e',
          },
          syncStatus: {
            universalIdentifier: '6189c285-d390-4fd9-ae7a-ca011d8ad98f',
          },
          createdAt: {
            universalIdentifier: '45044b65-b17b-468d-a23d-075733c6b631',
          },
        },
      },
      messageChannelRecordPageFields: {
        universalIdentifier: '1350eb34-7ef0-4b25-8a3e-23b4a959c3a2',
        viewFieldGroups: {
          general: {
            universalIdentifier: '96113215-6bf2-476c-ae69-c70274257913',
          },
          other: {
            universalIdentifier: '2f08a624-e1a7-4f79-b5f7-1a8e92f4c07e',
          },
        },
        viewFields: {
          connectedAccount: {
            universalIdentifier: '19079cf6-2a9c-40b9-b6c2-58d63c6e37ad',
          },
          type: {
            universalIdentifier: '280b9097-0bcf-4389-9ee7-fa89990d1369',
          },
          visibility: {
            universalIdentifier: '8dd39475-f109-4117-bce4-9e183382b475',
          },
          isSyncEnabled: {
            universalIdentifier: '5136d071-3b11-48cd-b7be-4910bd6264f9',
          },
          syncStatus: {
            universalIdentifier: '76db0713-06d3-4133-9144-9d0300a2824e',
          },
          createdAt: {
            universalIdentifier: '8636c740-3282-4a6b-99f6-f3f48e59b0af',
          },
          createdBy: {
            universalIdentifier: 'cdf294ce-4c52-4987-a301-8219fa81ab2e',
          },
        },
      },
    },
  },
  messageFolder: {
    universalIdentifier: '20202020-4955-4fd9-8e59-2dbd373f2a46',
    fields: {
      id: { universalIdentifier: '20202020-b03a-40d1-8ad1-dcedfefaabbc' },
      createdAt: {
        universalIdentifier: '20202020-b03b-40d2-9bd2-edfefaabbccd',
      },
      updatedAt: {
        universalIdentifier: '20202020-b03c-40d3-8cd3-fefaabbccdde',
      },
      deletedAt: {
        universalIdentifier: '20202020-b03d-40d4-9dd4-faabbccddeef',
      },
      name: { universalIdentifier: '20202020-7cf8-40bc-a681-b80b771449b7' },
      parentFolderId: {
        universalIdentifier: '20202020-e45d-49de-a4aa-587bbf9601f3',
      },
      messageChannelId: {
        universalIdentifier: '20202020-c9f8-43db-a3e7-7f2e8b5d9c1a',
      },
      syncCursor: {
        universalIdentifier: '20202020-98cd-49ed-8dfc-cb5796400e64',
      },
      isSentFolder: {
        universalIdentifier: '20202020-2af5-4a25-b2de-3c9386da941b',
      },
      isSynced: {
        universalIdentifier: '20202020-764f-4e09-8f95-cd46b6bfe3c4',
      },
      externalId: {
        universalIdentifier: '20202020-f3a8-4d2b-9c7e-1b5f9a8e4c6d',
      },
      pendingSyncAction: {
        universalIdentifier: '20202020-4f97-4c79-9517-16387fe237f7',
      },
      createdBy: {
        universalIdentifier: 'bfe19f84-b640-4ce3-b771-4e7bf18bad14',
      },
      updatedBy: {
        universalIdentifier: '7ec7eea8-8715-4656-a602-3cb4256aaca1',
      },
      position: {
        universalIdentifier: '5317d4f4-12c5-469d-8e47-0f3b2ffc95b4',
      },
      searchVector: {
        universalIdentifier: '5f2d3937-bafd-4d71-b4cb-b34037efd2e1',
      },
    },
    indexes: {
      messageChannelIdIndex: {
        universalIdentifier: '6217f2a5-28ac-4b88-8a2a-45eee4580e57',
      },
    },
    views: {
      allMessageFolders: {
        universalIdentifier: '6774ebf5-a300-4bcc-8f22-f5e7c58bfccf',
        viewFields: {
          name: {
            universalIdentifier: '72b2d56f-5245-4cb6-933c-3d5031de0778',
          },
          messageChannelId: {
            universalIdentifier: '121abdf0-c89f-4313-b156-e8a3c0cb77ec',
          },
          isSentFolder: {
            universalIdentifier: 'e884a006-e166-434d-82aa-247052165e4d',
          },
          isSynced: {
            universalIdentifier: 'd7e705f4-c2be-4f4e-bcc3-1cdc9e07990b',
          },
          createdAt: {
            universalIdentifier: 'afd4f595-c1a7-4afd-b0fd-b2f0b59203c6',
          },
        },
      },
      messageFolderRecordPageFields: {
        universalIdentifier: '82dc204f-a48d-4985-9259-a79b3a1b230f',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'c55a9366-bb2c-4ae7-8345-115c790f56b1',
          },
          other: {
            universalIdentifier: '51b6af5e-9f76-4fb2-811b-6193761d7702',
          },
        },
        viewFields: {
          messageChannelId: {
            universalIdentifier: '2fb6ff09-bed5-4b31-af0f-7fa3df5612da',
          },
          isSentFolder: {
            universalIdentifier: 'ec8a2e3e-0736-41f5-8c8b-d36778d52a94',
          },
          isSynced: {
            universalIdentifier: 'a68f286c-5d13-4794-9354-e282913930f5',
          },
          createdAt: {
            universalIdentifier: '8b63749b-922d-4164-b0f4-65d716b3d75d',
          },
          createdBy: {
            universalIdentifier: '2a93e132-3c92-4b94-acf0-076e4af75df2',
          },
        },
      },
    },
  },
  messageParticipant: {
    universalIdentifier: '20202020-a433-4456-aa2d-fd9cb26b774a',
    fields: {
      id: { universalIdentifier: '20202020-b04a-40e1-8ae1-1a2b3c4d5e6f' },
      createdAt: {
        universalIdentifier: '20202020-b04b-40e2-9be2-2b3c4d5e6f7a',
      },
      updatedAt: {
        universalIdentifier: '20202020-b04c-40e3-8ce3-3c4d5e6f7a8b',
      },
      deletedAt: {
        universalIdentifier: '20202020-b04d-40e4-9de4-4d5e6f7a8b9c',
      },
      message: {
        universalIdentifier: '20202020-985b-429a-9db9-9e55f4898a2a',
      },
      role: {
        universalIdentifier: '20202020-65d1-42f4-8729-c9ec1f52aecd',
      },
      handle: {
        universalIdentifier: '20202020-2456-464e-b422-b965a4db4a0b',
      },
      displayName: {
        universalIdentifier: '20202020-36dd-4a4f-ac02-228425be9fac',
      },
      person: {
        universalIdentifier: '20202020-249d-4e0f-82cd-1b9df5cd3da2',
      },
      workspaceMember: {
        universalIdentifier: '20202020-77a7-4845-99ed-1bcbb478be6f',
      },
      createdBy: {
        universalIdentifier: 'e0e6aa04-6ad5-4d12-8799-6febf00452c1',
      },
      updatedBy: {
        universalIdentifier: '6c90fd49-22b8-4f91-b4eb-4b9af630e988',
      },
      position: {
        universalIdentifier: 'f49ca74e-dcdf-445d-a707-3c22869b4e6c',
      },
      searchVector: {
        universalIdentifier: '80fec74f-cda7-46bd-ae37-8998bd4f992b',
      },
    },
    indexes: {
      messageIdIndex: {
        universalIdentifier: 'ab0863ba-f95e-493c-b86c-56e1bc7e5bc2',
      },
      personIdIndex: {
        universalIdentifier: 'df805c2e-3bfe-4d51-8309-75e5eb4052fe',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: 'ce1e3a9e-afe9-439d-abb7-6cc98a6fa405',
      },
    },
    views: {
      allMessageParticipants: {
        universalIdentifier: '8b7fbe7d-dae0-4285-8bdc-ec078a4de870',
        viewFields: {
          message: {
            universalIdentifier: 'ca491a31-8659-4202-9476-f0f72efc80b5',
          },
          role: {
            universalIdentifier: '55b74f7e-7c58-4fce-a44b-a8d9671ec541',
          },
          handle: {
            universalIdentifier: 'abcbb5d9-b8c2-46bb-b3cc-ea035be8f3be',
          },
          displayName: {
            universalIdentifier: '8d0c8202-b57f-4450-a090-a7eb26aa2299',
          },
          person: {
            universalIdentifier: '26d0f3f1-43d3-425c-930c-81147451d0f8',
          },
          workspaceMember: {
            universalIdentifier: 'df62dcbc-c22d-4d34-9fa5-6f70bae02161',
          },
          createdAt: {
            universalIdentifier: '636ff7b6-86b8-49fc-9442-39f4c24ff424',
          },
        },
      },
      messageParticipantRecordPageFields: {
        universalIdentifier: '209ab5c5-4a68-4d32-8255-515919a6c5f5',
        viewFieldGroups: {
          general: {
            universalIdentifier: '41c18430-34c3-430f-b86b-fc3963281277',
          },
          other: {
            universalIdentifier: 'add21830-a7c6-4cde-9eed-430afbcbf557',
          },
        },
        viewFields: {
          message: {
            universalIdentifier: 'dd8ccf4f-64d7-468c-bc0c-dc4e0efef08d',
          },
          role: {
            universalIdentifier: '5d1f9a65-85cc-41b2-a8bf-8e2c97aab4b3',
          },
          displayName: {
            universalIdentifier: 'c50748fe-9f54-4e09-b572-111f076ec7db',
          },
          person: {
            universalIdentifier: 'bf2e30dd-df03-4fb2-820a-166a93a2ce2c',
          },
          workspaceMember: {
            universalIdentifier: '00336686-0d63-43e2-b247-599f1227bd85',
          },
          createdAt: {
            universalIdentifier: '8d66ecb8-825d-4c6c-91c0-23a82c87ab46',
          },
          createdBy: {
            universalIdentifier: '17c3acfc-71f1-4b3c-820e-aea23871e850',
          },
        },
      },
    },
  },
  messageThread: {
    universalIdentifier: '20202020-849a-4c3e-84f5-a25a7d802271',
    fields: {
      id: { universalIdentifier: '20202020-b05a-40f1-8af1-5e6f7a8b9cad' },
      createdAt: {
        universalIdentifier: '20202020-b05b-40f2-9bf2-6f7a8b9cadbe',
      },
      updatedAt: {
        universalIdentifier: '20202020-b05c-40f3-8cf3-7a8b9cadbecf',
      },
      deletedAt: {
        universalIdentifier: '20202020-b05d-40f4-9df4-8b9cadbecfda',
      },
      messages: {
        universalIdentifier: '20202020-3115-404f-aade-e1154b28e35a',
      },
      messageChannelMessageAssociations: {
        universalIdentifier: '20202020-314e-40a4-906d-a5d5d6c285f6',
      },
      createdBy: {
        universalIdentifier: 'b50ce369-9905-46d9-b95b-5e4034d252aa',
      },
      updatedBy: {
        universalIdentifier: '20fbafd0-0a16-4785-b5a6-f1ef45ef304c',
      },
      position: {
        universalIdentifier: '7490a440-7a62-466e-ba93-75a2f2edfb1e',
      },
      searchVector: {
        universalIdentifier: 'c63e091f-6528-4657-ad2a-b0a158f9e483',
      },
      subject: {
        universalIdentifier: 'a8ddbf8c-1137-45d1-b89e-5ffbd83f67c8',
      },
    },
    indexes: {},
    views: {
      allMessageThreads: {
        universalIdentifier: '20202020-d002-4d02-8d02-ae55a9ba2002',
        viewFields: {
          subject: {
            universalIdentifier: 'e5f0d32b-2b6a-47bc-b3bd-f32c96594ec1',
          },
          messages: {
            universalIdentifier: '20202020-df02-4d02-8d02-ae55a9ba2f01',
          },
          updatedAt: {
            universalIdentifier: 'af2c6ac9-7083-4609-8172-d518441f5e9e',
          },
          createdAt: {
            universalIdentifier: '20202020-df02-4d02-8d02-ae55a9ba2f02',
          },
        },
      },
    },
  },
  message: {
    universalIdentifier: '20202020-3f6b-4425-80ab-e468899ab4b2',
    fields: {
      id: { universalIdentifier: '20202020-b06a-4101-8a01-9cadbedfaeb1' },
      createdAt: {
        universalIdentifier: '20202020-b06b-4102-9b02-adbecfeafbc2',
      },
      updatedAt: {
        universalIdentifier: '20202020-b06c-4103-8c03-becfdfabfcd3',
      },
      deletedAt: {
        universalIdentifier: '20202020-b06d-4104-9d04-cfdfabecdde4',
      },
      headerMessageId: {
        universalIdentifier: '20202020-72b5-416d-aed8-b55609067d01',
      },
      messageThread: {
        universalIdentifier: '20202020-30f2-4ccd-9f5c-e41bb9d26214',
      },
      direction: {
        universalIdentifier: '20202020-0203-4118-8e2a-05b9bdae6dab',
      },
      subject: { universalIdentifier: '20202020-52d1-4036-b9ae-84bd722bb37a' },
      text: { universalIdentifier: '20202020-d2ee-4e7e-89de-9a0a9044a143' },
      receivedAt: {
        universalIdentifier: '20202020-140a-4a2a-9f86-f13b6a979afc',
      },
      messageParticipants: {
        universalIdentifier: '20202020-7cff-4a74-b63c-73228448cbd9',
      },
      messageChannelMessageAssociations: {
        universalIdentifier: '20202020-3cef-43a3-82c6-50e7cfbc9ae4',
      },
      createdBy: {
        universalIdentifier: '6e52bde4-ed41-4462-aa70-121e496270b4',
      },
      updatedBy: {
        universalIdentifier: '7822dcc0-ee40-4af0-a6fe-f10a14e72b24',
      },
      position: {
        universalIdentifier: '06c5052d-3369-4d6d-8eaa-f9780eddb1fd',
      },
      searchVector: {
        universalIdentifier: '529b6008-4a12-4d48-bbc3-26a3f199bafd',
      },
    },
    indexes: {
      messageThreadIdIndex: {
        universalIdentifier: '7a05b45e-7aa6-4a7e-9bbc-299cbed53c96',
      },
    },
    views: {
      allMessages: {
        universalIdentifier: '20202020-d001-4d01-8d01-ae55a9e5a001',
        viewFields: {
          subject: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af01',
          },
          messageThread: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af02',
          },
          messageParticipants: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af03',
          },
          receivedAt: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af04',
          },
          headerMessageId: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af05',
          },
          text: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af06',
          },
          createdAt: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af07',
          },
        },
      },
    },
  },
  note: {
    universalIdentifier: '20202020-0b00-45cd-b6f6-6cd806fc6804',
    fields: {
      id: { universalIdentifier: '20202020-c01a-4111-8a11-dfabcddeef12' },
      createdAt: {
        universalIdentifier: '20202020-c01b-4112-9b12-fabcddefe123',
      },
      updatedAt: {
        universalIdentifier: '20202020-c01c-4113-8c13-abcddeef1234',
      },
      deletedAt: {
        universalIdentifier: '20202020-c01d-4114-9d14-bcddeef12345',
      },
      position: { universalIdentifier: '20202020-368d-4dc2-943f-ed8a49c7fdfb' },
      title: { universalIdentifier: '20202020-faeb-4c76-8ba6-ccbb0b4a965f' },
      bodyV2: { universalIdentifier: '20202020-a7bb-4d94-be51-8f25181502c8' },
      createdBy: {
        universalIdentifier: '20202020-0d79-4e21-ab77-5a394eff97be',
      },
      updatedBy: {
        universalIdentifier: '9b446e89-2484-4044-a3b5-420f6b578c0c',
      },
      noteTargets: {
        universalIdentifier: '20202020-1f25-43fe-8b00-af212fdde823',
      },
      attachments: {
        universalIdentifier: '20202020-4986-4c92-bf19-39934b149b16',
      },
      timelineActivities: {
        universalIdentifier: '20202020-7030-42f8-929c-1a57b25d6bce',
      },
      favorites: {
        universalIdentifier: '20202020-4d1d-41ac-b13b-621631298d67',
      },
      searchVector: {
        universalIdentifier: '20202020-7ea8-44d4-9d4c-51dd2a757950',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: '8183c8d2-9114-4b6e-8c5d-12a3b14a5a13',
      },
    },
    views: {
      allNotes: {
        universalIdentifier: '20202020-a005-4a05-8a05-a0be5a11a000',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af00',
          },
          noteTargets: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af01',
          },
          bodyV2: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af02',
          },
          createdBy: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af03',
          },
          createdAt: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af04',
          },
        },
      },
      noteRecordPageFields: {
        universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115101',
          },
          additional: {
            universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115102',
          },
          other: {
            universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115103',
          },
        },
        viewFields: {
          createdAt: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115202',
          },
          createdBy: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115203',
          },
          noteTargets: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115204',
          },
          bodyV2: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115205',
          },
          updatedAt: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115206',
          },
          updatedBy: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115207',
          },
          attachments: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115208',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115209',
          },
          favorites: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11520a',
          },
        },
      },
    },
  },
  noteTarget: {
    universalIdentifier: '20202020-fff0-4b44-be82-bda313884400',
    fields: {
      id: { universalIdentifier: '20202020-c02a-4121-8a21-cddeef123456' },
      createdAt: {
        universalIdentifier: '20202020-c02b-4122-9b22-ddeef1234567',
      },
      updatedAt: {
        universalIdentifier: '20202020-c02c-4123-8c23-eef12345678a',
      },
      deletedAt: {
        universalIdentifier: '20202020-c02d-4124-9d24-ef123456789b',
      },
      note: { universalIdentifier: '20202020-57f3-4f50-9599-fc0f671df003' },
      targetPerson: {
        universalIdentifier: '20202020-38ca-4aab-92f5-8a605ca2e4c5',
      },
      targetCompany: {
        universalIdentifier: 'c500fbc0-d6f2-4982-a959-5a755431696c',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-4e42-417a-a705-76581c9ade79',
      },
      targetCampaign: {
        universalIdentifier: 'deb5d45c-d821-4b50-ac62-f173f7ea3d42',
      },
      targetTrackedDocument: {
        universalIdentifier: '780b4050-ee19-472c-af8d-2ed4aacb4e52',
      },
      targetMeetingType: {
        universalIdentifier: '4cacef21-e63e-47ac-97de-bb66dc485f1b',
      },
      targetChatWidget: {
        universalIdentifier: '50d1147b-2ee1-410c-852f-6f292e7622fb',
      },
      targetSequence: {
        universalIdentifier: '63eb182a-5a4c-496f-a1e9-1d6992a25348',
      },
      targetQuote: {
        universalIdentifier: 'f9117215-5dcf-4d71-8f0a-8a93b2cc7d28',
      },
      createdBy: {
        universalIdentifier: '820a3163-bb7d-41bc-93d9-81a464559c48',
      },
      updatedBy: {
        universalIdentifier: 'a48c2bae-fe78-4d9d-bc37-f56d1a462121',
      },
      position: {
        universalIdentifier: '082f7c9e-5ccd-4056-8748-a428f65fa6f6',
      },
      searchVector: {
        universalIdentifier: '0cc32d0f-99ab-4fee-bf66-9e84bc8bce00',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-f635-435d-ab8d-e1168b375c70' },
    },
    indexes: {
      noteIdIndex: {
        universalIdentifier: '9294d9e3-0225-4c7f-9d6e-23b4c25b6b24',
      },
      personIdIndex: {
        universalIdentifier: '7c069dc0-e83b-4cd5-aaa2-cac7f3e00d80',
      },
      companyIdIndex: {
        universalIdentifier: '2d83909a-a383-4e82-b00a-8b7739f3f906',
      },
      opportunityIdIndex: {
        universalIdentifier: '0d1a59b4-cc87-4b7d-804a-656e8504f371',
      },
      campaignIdIndex: {
        universalIdentifier: '37ba6566-2302-4c68-a86d-8574e556873c',
      },
      trackedDocumentIdIndex: {
        universalIdentifier: 'd05e909c-be9e-4534-a50a-799865406775',
      },
      meetingTypeIdIndex: {
        universalIdentifier: '298054e2-611d-40fd-a4fd-2ec7c60c34bb',
      },
      chatWidgetIdIndex: {
        universalIdentifier: 'e3164301-0d75-4f4d-97bc-4ab85408aba3',
      },
      sequenceIdIndex: {
        universalIdentifier: '911ed1d8-33d0-4a44-a6a7-7495ab1d9065',
      },
      quoteIdIndex: {
        universalIdentifier: 'aa145f9c-6af4-4c27-a104-e89968ee2816',
      },
    },
    views: {
      allNoteTargets: {
        universalIdentifier: 'd124d587-ef78-402b-9341-7673e6cea033',
        viewFields: {
          id: {
            universalIdentifier: 'f2d912fe-7c6f-4a9c-b808-b7b5a18d2818',
          },
          note: {
            universalIdentifier: '9d4ac173-d32b-4a44-9dbd-8a47ab844f98',
          },
          targetPerson: {
            universalIdentifier: 'b6f67de5-c5cf-4235-b740-a6a007c8eae3',
          },
          targetCompany: {
            universalIdentifier: 'a9c7f370-4b22-4f29-8e3f-678e91a59576',
          },
          targetOpportunity: {
            universalIdentifier: '3efeb162-cd03-458b-9c7b-47032d045204',
          },
        },
      },
    },
  },
  opportunity: {
    universalIdentifier: '20202020-9549-49dd-b2b2-883999db8938',
    fields: {
      id: { universalIdentifier: '20202020-d01a-4131-8a31-f123456789ab' },
      createdAt: {
        universalIdentifier: '20202020-d01b-4132-9b32-123456789abc',
      },
      updatedAt: {
        universalIdentifier: '20202020-d01c-4133-8c33-23456789abcd',
      },
      deletedAt: {
        universalIdentifier: '20202020-d01d-4134-9d34-3456789abcde',
      },
      name: { universalIdentifier: '20202020-8609-4f65-a2d9-44009eb422b5' },
      amount: { universalIdentifier: '20202020-583e-4642-8533-db761d5fa82f' },
      closeDate: {
        universalIdentifier: '20202020-527e-44d6-b1ac-c4158d307b97',
      },
      stage: { universalIdentifier: '20202020-6f76-477d-8551-28cd65b2b4b9' },
      position: {
        universalIdentifier: '20202020-806d-493a-bbc6-6313e62958e2',
      },
      createdBy: {
        universalIdentifier: '20202020-a63e-4a62-8e63-42a51828f831',
      },
      updatedBy: {
        universalIdentifier: '3c8a6095-3f64-4e81-a59e-66c2bd181e11',
      },
      pointOfContact: {
        universalIdentifier: '20202020-8dfb-42fc-92b6-01afb759ed16',
      },
      company: { universalIdentifier: '20202020-cbac-457e-b565-adece5fc815f' },
      owner: { universalIdentifier: '20202020-be7e-4d1e-8e19-3d5c7c4b9f2a' },
      favorites: {
        universalIdentifier: '20202020-a1c2-4500-aaae-83ba8a0e827a',
      },
      taskTargets: {
        universalIdentifier: '20202020-59c0-4179-a208-4a255f04a5be',
      },
      noteTargets: {
        universalIdentifier: '20202020-dd3f-42d5-a382-db58aabf43d3',
      },
      attachments: {
        universalIdentifier: '20202020-87c7-4118-83d6-2f4031005209',
      },
      timelineActivities: {
        universalIdentifier: '20202020-30e2-421f-96c7-19c69d1cf631',
      },
      quotes: {
        universalIdentifier: '7ec6959a-cb6c-42ba-97c3-a776a42b021e',
      },
      searchVector: {
        universalIdentifier: '428a0da5-4b2e-4ce3-b695-89a8b384e6e3',
      },
    },
    indexes: {
      pointOfContactIdIndex: {
        universalIdentifier: 'b8c2a673-a981-4357-a43d-313a358e4daa',
      },
      companyIdIndex: {
        universalIdentifier: 'e161072d-37b1-477a-b944-ef0d65289574',
      },
      stageIndex: {
        universalIdentifier: 'ae60d580-b562-44f2-a24d-7b8040063f83',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'f53fdd28-a26b-47ba-81b5-6813ad622720',
      },
    },
    views: {
      allOpportunities: {
        universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca1ba0',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1baf',
          },
          amount: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb0',
          },
          createdBy: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb1',
          },
          closeDate: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb2',
          },
          company: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb3',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb4',
          },
        },
      },
      byStage: {
        universalIdentifier: '20202020-a004-4a04-8a04-0aa0b1ca1ba0',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2baf',
          },
          amount: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb0',
          },
          createdBy: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb1',
          },
          closeDate: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb2',
          },
          company: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb3',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb4',
          },
        },
        viewGroups: {
          new: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf1',
          },
          screening: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf2',
          },
          meeting: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf3',
          },
          proposal: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf4',
          },
          customer: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf5',
          },
        },
      },
      opportunityRecordPageFields: {
        universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3101',
          },
          additional: {
            universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3102',
          },
          other: {
            universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3103',
          },
        },
        viewFields: {
          amount: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3201',
          },
          closeDate: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3202',
          },
          stage: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3203',
          },
          company: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3204',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3205',
          },
          owner: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3206',
          },
          createdAt: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3207',
          },
          createdBy: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3208',
          },
          updatedAt: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320a',
          },
          updatedBy: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320b',
          },
          favorites: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320c',
          },
          taskTargets: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320d',
          },
          noteTargets: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320e',
          },
          attachments: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320f',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3210',
          },
        },
      },
    },
  },
  person: {
    universalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
    fields: {
      id: { universalIdentifier: '20202020-e01a-4141-8a41-456789abcdef' },
      createdAt: {
        universalIdentifier: '20202020-e01b-4142-9b42-56789abcdefa',
      },
      updatedAt: {
        universalIdentifier: '20202020-e01c-4143-8c43-6789abcdefab',
      },
      deletedAt: {
        universalIdentifier: '20202020-e01d-4144-9d44-789abcdefabc',
      },
      name: { universalIdentifier: '20202020-3875-44d5-8c33-a6239011cab8' },
      emails: { universalIdentifier: '20202020-3c51-43fa-8b6e-af39e29368ab' },
      linkedinLink: {
        universalIdentifier: '20202020-f1af-48f7-893b-2007a73dd508',
      },
      xLink: { universalIdentifier: '20202020-8fc2-487c-b84a-55a99b145cfd' },
      jobTitle: { universalIdentifier: '20202020-b0d0-415a-bef9-640a26dacd9b' },
      phones: { universalIdentifier: '20202020-0638-448e-8825-439134618022' },
      city: { universalIdentifier: '20202020-5243-4ffb-afc5-2c675da41346' },
      avatarUrl: {
        universalIdentifier: '20202020-b8a6-40df-961c-373dc5d2ec21',
      },
      avatarFile: {
        universalIdentifier: '20202020-a7c9-4e3d-8f1b-2d5a6b7c8e9f',
      },
      position: { universalIdentifier: '20202020-fcd5-4231-aff5-fff583eaa0b1' },
      createdBy: {
        universalIdentifier: '20202020-f6ab-4d98-af24-a3d5b664148a',
      },
      updatedBy: {
        universalIdentifier: 'e9e0dd35-184c-4742-84da-afadf45ce59a',
      },
      company: { universalIdentifier: '20202020-e2f3-448e-b34c-2d625f0025fd' },
      pointOfContactForOpportunities: {
        universalIdentifier: '20202020-911b-4a7d-b67b-918aa9a5b33a',
      },
      taskTargets: {
        universalIdentifier: '20202020-584b-4d3e-88b6-53ab1fa03c3a',
      },
      noteTargets: {
        universalIdentifier: '20202020-c8fc-4258-8250-15905d3fcfec',
      },
      favorites: {
        universalIdentifier: '20202020-4073-4117-9cf1-203bcdc91cbd',
      },
      attachments: {
        universalIdentifier: '20202020-cd97-451f-87fa-bcb789bdbf3a',
      },
      messageParticipants: {
        universalIdentifier: '20202020-498e-4c61-8158-fa04f0638334',
      },
      calendarEventParticipants: {
        universalIdentifier: '20202020-52ee-45e9-a702-b64b3753e3a9',
      },
      timelineActivities: {
        universalIdentifier: '20202020-a43e-4873-9c23-e522de906ce5',
      },
      campaignRecipients: {
        universalIdentifier: 'a70976da-563f-41a2-b969-462dc3498775',
      },
      dripEnrollments: {
        universalIdentifier: 'aafd96dd-4abb-47ce-b211-09fc9ef38ad6',
      },
      documentSharingLinks: {
        universalIdentifier: '3f086ef3-fbec-4680-94c8-8f5d6de06ea3',
      },
      documentViews: {
        universalIdentifier: '6aa2a9a1-dc84-47ce-9436-dd2ab02172da',
      },
      bookings: {
        universalIdentifier: '7bb3b0b2-ed95-48df-a547-ee3bc13183eb',
      },
      chatConversations: {
        universalIdentifier: '8cc4c1c3-fe06-49e0-b658-ff4cd24294fc',
      },
      sequenceEnrollments: {
        universalIdentifier: '9dd5d2d4-0f17-40f1-8769-005de3530a0d',
      },
      quotes: {
        universalIdentifier: '6d24a795-62d5-4eb4-85e1-d9fef6c11d7d',
      },
      searchVector: {
        universalIdentifier: '57d1d7ad-fa10-44fc-82f3-ad0959ec2534',
      },
    },
    indexes: {
      companyIdIndex: {
        universalIdentifier: '8a265a5c-d3ae-47dc-bdf9-b42cfa2ba639',
      },
      emailsUniqueIndex: {
        universalIdentifier: '8183a8b2-9114-4f6c-8a5b-12e3f14e5e13',
      },
      searchVectorGinIndex: {
        universalIdentifier: '9294b9c3-0225-4a7d-9b6c-23f4a25f6f24',
      },
    },
    views: {
      allPeople: {
        universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea11a00',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af0',
          },
          emails: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af1',
          },
          createdBy: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af2',
          },
          company: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af3',
          },
          phones: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af4',
          },
          createdAt: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af5',
          },
          city: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af6',
          },
          jobTitle: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af7',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af8',
          },
          xLink: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af9',
          },
        },
      },
      personRecordPageFields: {
        universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12101',
          },
          additional: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12102',
          },
          other: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12103',
          },
        },
        viewFields: {
          emails: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12201',
          },
          phones: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12202',
          },
          company: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12203',
          },
          jobTitle: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12204',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12205',
          },
          xLink: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12206',
          },
          city: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12207',
          },
          avatarUrl: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12208',
          },
          createdAt: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12209',
          },
          createdBy: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12210',
          },
          updatedAt: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12212',
          },
          updatedBy: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12213',
          },
          avatarFile: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12214',
          },
          pointOfContactForOpportunities: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12215',
          },
          taskTargets: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12216',
          },
          noteTargets: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12217',
          },
          favorites: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12218',
          },
          attachments: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12219',
          },
          messageParticipants: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea1221a',
          },
          calendarEventParticipants: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea1221b',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea1221c',
          },
        },
      },
    },
  },
  quote: {
    universalIdentifier: 'a8b190de-d5a5-48e2-a5df-32aca76116ac',
    fields: {
      id: { universalIdentifier: '741da3d5-ee2b-4164-88d6-83f34f9bb2fe' },
      createdAt: {
        universalIdentifier: 'a40db1e6-0b49-4db3-8cd8-0b903d7f9726',
      },
      updatedAt: {
        universalIdentifier: 'dce7631d-79cd-44e8-b844-4c8f0af6c9f9',
      },
      deletedAt: {
        universalIdentifier: '9a268b1c-dc1b-4dbf-9a80-25e7ce425521',
      },
      name: { universalIdentifier: '6ef774f3-bc33-4e5e-b1e4-7934e936fc33' },
      quoteNumber: {
        universalIdentifier: 'b8d36a53-ca63-4dcc-84b1-8aecf16b2833',
      },
      status: { universalIdentifier: '45b72c86-1261-4827-b67f-8ca29a7510b5' },
      issueDate: {
        universalIdentifier: 'a57f51ee-1598-4703-aaf1-f45887934b4e',
      },
      expiryDate: {
        universalIdentifier: 'c2864468-d827-4bf2-be4e-91c7f7ef9846',
      },
      acceptedAt: {
        universalIdentifier: '463530d2-18e7-427e-ad8c-8a0d3d8cae4c',
      },
      rejectedAt: {
        universalIdentifier: '2591100a-2a16-4d4f-bea4-10d59db2a598',
      },
      subtotal: {
        universalIdentifier: '73c57e04-7227-4af1-8ce9-95acd5fa2b3b',
      },
      taxAmount: {
        universalIdentifier: '12296e3d-2c1f-4d83-9f54-9defc177c521',
      },
      discount: {
        universalIdentifier: 'c87c43bb-6c4c-4ad1-8293-4f85b1d64a14',
      },
      total: { universalIdentifier: '02c787cb-1efa-4e25-999f-5dea922292b8' },
      taxRate: { universalIdentifier: '82ebaf6f-dfaa-4f41-be2b-faf46ee8ed98' },
      notes: { universalIdentifier: 'd963e928-f8a6-4193-8569-babf77872576' },
      terms: { universalIdentifier: '742edf99-2e8c-4724-a991-256bfeb773b9' },
      rejectionReason: {
        universalIdentifier: '589a9512-5756-4b3b-9841-4743d39c5940',
      },
      clientSignature: {
        universalIdentifier: 'b706eeb1-2540-4065-adc0-a26cabfda261',
      },
      currency: {
        universalIdentifier: 'aacf8184-0094-43c6-a07d-4329fa089e77',
      },
      position: {
        universalIdentifier: '348d647c-e5bb-4432-8b68-edfc0866e7d2',
      },
      searchVector: {
        universalIdentifier: '9e6eb612-235a-417e-90ed-c888336259ae',
      },
      createdBy: {
        universalIdentifier: '1701aca3-01d0-4404-b63a-071e089277d8',
      },
      updatedBy: {
        universalIdentifier: '6b184ad9-1db9-4933-9a6f-8ea81f0754ee',
      },
      opportunity: {
        universalIdentifier: 'f3887f24-7dbf-4be4-8d3b-fccb0bda8b77',
      },
      company: { universalIdentifier: 'a438f2a2-9c9d-4248-b965-0dbb88027153' },
      pointOfContact: {
        universalIdentifier: '531a25e6-9331-4ec4-9d5a-8b6e98a4ff16',
      },
      lineItems: {
        universalIdentifier: '79dd3b46-ecb1-4bef-9b97-9aadd33e167a',
      },
      sharingLinks: {
        universalIdentifier: 'fff15d82-bced-4a21-8dac-3bb43e0640bf',
      },
      noteTargets: {
        universalIdentifier: '564addfc-3ead-44b2-9f9b-ad85345c758e',
      },
      taskTargets: {
        universalIdentifier: '89b629b9-a0f1-4b1a-ae80-bf0ed78f72cf',
      },
      attachments: {
        universalIdentifier: 'd480d498-6602-4f07-80d3-1b93719bf0f5',
      },
    },
    indexes: {
      quoteNumberIndex: {
        universalIdentifier: '0da1a4f1-cc11-42c1-890f-164d86815e85',
      },
      opportunityIdIndex: {
        universalIdentifier: '73d04fa8-ea6b-4101-8c4d-784e695cce57',
      },
      companyIdIndex: {
        universalIdentifier: '4680f8fe-519c-4ca7-a7c2-1916eca8d083',
      },
      pointOfContactIdIndex: {
        universalIdentifier: 'a45a041e-4095-4791-b078-50afb059a1ef',
      },
    },
    views: {
      allQuotes: {
        universalIdentifier: 'd8a0a820-723e-4c9d-9305-ed8c80b5c1cc',
        viewFields: {
          name: {
            universalIdentifier: '38f177ec-8663-4ab6-ad6c-caa63d0f218a',
          },
          quoteNumber: {
            universalIdentifier: '6f80fbf2-ee24-4cf2-aa1e-cbae35de7866',
          },
          status: {
            universalIdentifier: 'd32d1b85-17ae-4b47-bcaa-530565b6d04e',
          },
          issueDate: {
            universalIdentifier: '7f132cb4-1472-472a-9b0d-2070d5231dd4',
          },
          expiryDate: {
            universalIdentifier: '266978d7-806c-46b2-9e43-da00d1be6688',
          },
          total: {
            universalIdentifier: 'e6c8555e-b279-4e2c-a1e2-c44dfc33aafa',
          },
          company: {
            universalIdentifier: '942f5426-03fa-4b0e-b9d2-733c5d9dceb1',
          },
          pointOfContact: {
            universalIdentifier: '949582f9-a455-4446-a3b2-a622b8486531',
          },
          createdAt: {
            universalIdentifier: '69029b42-b229-45dd-945a-a1f21420278a',
          },
        },
      },
    },
  },
  quoteLineItem: {
    universalIdentifier: '1f25542a-13d8-4b83-a3a3-b721536adfe2',
    fields: {
      id: { universalIdentifier: 'c5e92a58-5263-4af0-bb16-09ad5fda9376' },
      createdAt: {
        universalIdentifier: 'e3b561ce-5a73-4282-afcc-3520748cfa6e',
      },
      updatedAt: {
        universalIdentifier: '66499e7a-8782-4f78-8767-1001ddf23ff8',
      },
      deletedAt: {
        universalIdentifier: 'c08db08f-0b5f-46b4-b930-388a344f2d4f',
      },
      name: { universalIdentifier: '678d062c-b5b4-4fcb-ae5f-43e9f61776e7' },
      description: {
        universalIdentifier: 'ebba3c0c-0195-4bf9-8618-9e1f9b09b797',
      },
      quantity: {
        universalIdentifier: '86bc4aa6-043a-47f2-9ef9-c8e75a699aab',
      },
      unitPrice: {
        universalIdentifier: '9d8b8473-31cb-4188-91ab-0d3ea3a22c25',
      },
      discount: {
        universalIdentifier: 'c82e5b1a-ef14-459f-aad3-e9304d772c14',
      },
      total: { universalIdentifier: '87d5a3a9-a3bb-451f-bfbf-6df231332b70' },
      position: {
        universalIdentifier: '4bae6ce0-7b00-4c51-89a7-02bc8efa7d96',
      },
      searchVector: {
        universalIdentifier: 'd78c541e-7b3a-45e7-bdd1-4cae81fd8c25',
      },
      createdBy: {
        universalIdentifier: '834dc94b-83f5-47ff-b114-2e94d70c5f59',
      },
      updatedBy: {
        universalIdentifier: 'c0bed573-5884-481f-b4a5-b67c705287c2',
      },
      quote: { universalIdentifier: 'dbaa5e68-72e0-49e0-a9c4-371e247768df' },
    },
    indexes: {
      quoteIdIndex: {
        universalIdentifier: 'dbf3c16b-96b9-4a6e-bde4-e2d8b5b76ddc',
      },
    },
    views: {
      allQuoteLineItems: {
        universalIdentifier: '95734c13-36e9-4ca2-879a-5ed28fef2a75',
        viewFields: {
          name: {
            universalIdentifier: 'df44f43f-4e36-4ef3-b9b9-72e4231f2c3e',
          },
          description: {
            universalIdentifier: '7a2095ee-eb42-40bb-a953-17ec299e9af5',
          },
          quantity: {
            universalIdentifier: '57032b59-2daa-4031-82af-066f618c7a5b',
          },
          unitPrice: {
            universalIdentifier: 'e050b3b5-bc7f-4aa4-91e6-5325e5cef15a',
          },
          total: {
            universalIdentifier: 'fd45bd4a-babf-45db-ae39-deae51f5c088',
          },
          quote: {
            universalIdentifier: 'c56d3cb2-9efc-429e-8e3d-4554cd8ee1c1',
          },
        },
      },
    },
  },
  task: {
    universalIdentifier: '20202020-1ba1-48ba-bc83-ef7e5990ed10',
    fields: {
      id: { universalIdentifier: '20202020-a02a-4151-8a51-89abcdefabcd' },
      createdAt: {
        universalIdentifier: '20202020-a02b-4152-9b52-9abcdefabcde',
      },
      updatedAt: {
        universalIdentifier: '20202020-a02c-4153-8c53-abcdefabcdef',
      },
      deletedAt: {
        universalIdentifier: '20202020-a02d-4154-9d54-bcdefabcdefa',
      },
      position: { universalIdentifier: '20202020-7d47-4690-8a98-98b9a0c05dd8' },
      title: { universalIdentifier: '20202020-b386-4cb7-aa5a-08d4a4d92680' },
      bodyV2: { universalIdentifier: '20202020-4aa0-4ae8-898d-7df0afd47ab1' },
      dueAt: { universalIdentifier: '20202020-fd99-40da-951b-4cb9a352fce3' },
      status: { universalIdentifier: '20202020-70bc-48f9-89c5-6aa730b151e0' },
      createdBy: {
        universalIdentifier: '20202020-1a04-48ab-a567-576965ae5387',
      },
      updatedBy: {
        universalIdentifier: '9e8bf518-f4ab-433e-9674-efb75fba2802',
      },
      taskTargets: {
        universalIdentifier: '20202020-de9c-4d0e-a452-713d4a3e5fc7',
      },
      attachments: {
        universalIdentifier: '20202020-794d-4783-a8ff-cecdb15be139',
      },
      assignee: { universalIdentifier: '20202020-065a-4f42-a906-e20422c1753f' },
      timelineActivities: {
        universalIdentifier: '20202020-c778-4278-99ee-23a2837aee64',
      },
      favorites: {
        universalIdentifier: '20202020-4d1d-41ac-b13b-621631298d65',
      },
      searchVector: {
        universalIdentifier: '20202020-4746-4e2f-870c-52b02c67c90d',
      },
    },
    indexes: {
      assigneeIdIndex: {
        universalIdentifier: 'f48fa3b1-0cec-44da-a9e5-f8a5e766637e',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'a86b32b3-01d3-4302-a152-8b7f247db7b4',
      },
    },
    views: {
      allTasks: {
        universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a1ea0',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eaf',
          },
          status: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb0',
          },
          taskTargets: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb1',
          },
          createdBy: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb2',
          },
          dueAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb3',
          },
          assignee: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb4',
          },
          bodyV2: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb5',
          },
          createdAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb6',
          },
        },
      },
      assignedToMe: {
        universalIdentifier: '20202020-a007-4a07-8a07-ba5ca551aaed',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaed',
          },
          taskTargets: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaee',
          },
          createdBy: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaef',
          },
          dueAt: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf0',
          },
          assignee: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf1',
          },
          bodyV2: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf2',
          },
          createdAt: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf3',
          },
        },
        viewFilters: {
          assigneeIsMe: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf1',
          },
        },
        viewGroups: {
          todo: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf2',
          },
          inProgress: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf3',
          },
          done: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf4',
          },
          empty: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf5',
          },
        },
      },
      byStatus: {
        universalIdentifier: '20202020-a008-4a08-8a08-ba5cba51aba5',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf0',
          },
          status: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf1',
          },
          dueAt: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf2',
          },
          assignee: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf3',
          },
          createdAt: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf4',
          },
        },
        viewGroups: {
          todo: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf01',
          },
          inProgress: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf02',
          },
          done: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf03',
          },
        },
      },
      taskRecordPageFields: {
        universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6101',
          },
          additional: {
            universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6102',
          },
          other: {
            universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6103',
          },
        },
        viewFields: {
          dueAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6202',
          },
          status: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6203',
          },
          assignee: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6204',
          },
          createdAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6205',
          },
          createdBy: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6206',
          },
          taskTargets: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6207',
          },
          bodyV2: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6208',
          },
          updatedAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6209',
          },
          updatedBy: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620a',
          },
          attachments: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620b',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620c',
          },
          favorites: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620d',
          },
        },
      },
    },
  },
  taskTarget: {
    universalIdentifier: '20202020-5a9a-44e8-95df-771cd06d0fb1',
    fields: {
      id: { universalIdentifier: '20202020-a03a-4161-8a61-cdefabcdefab' },
      createdAt: {
        universalIdentifier: '20202020-a03b-4162-9b62-defabcdefabc',
      },
      updatedAt: {
        universalIdentifier: '20202020-a03c-4163-8c63-efabcdefabcd',
      },
      deletedAt: {
        universalIdentifier: '20202020-a03d-4164-9d64-fabcdefabcde',
      },
      task: { universalIdentifier: '20202020-e881-457a-8758-74aaef4ae78a' },
      targetPerson: {
        universalIdentifier: '20202020-c8a0-4e85-a016-87e2349cfbec',
      },
      targetCompany: {
        universalIdentifier: '20202020-4703-4a4e-948c-487b0c60a92c',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-6cb2-4c01-a9a5-aca3dbc11d41',
      },
      targetTrackedDocument: {
        universalIdentifier: '945bb5ec-78c1-49aa-bef7-b60f0d116dd2',
      },
      targetMeetingType: {
        universalIdentifier: 'b0a25117-a39a-4503-894c-07bac0416f8f',
      },
      targetChatWidget: {
        universalIdentifier: 'b160114f-bdac-4d96-835d-1b513e96cb4b',
      },
      targetSequence: {
        universalIdentifier: 'dc2ebb71-f064-46d5-a004-bb2b8035ae09',
      },
      targetQuote: {
        universalIdentifier: 'c0639a62-c03d-45f6-b5d4-103f07028557',
      },
      createdBy: {
        universalIdentifier: '65fe2a53-45e4-4225-9711-b827f55e51cc',
      },
      updatedBy: {
        universalIdentifier: 'bea3734f-aff2-49ed-9dc9-d4666a2e2178',
      },
      position: {
        universalIdentifier: '4216c06a-498b-4111-9577-d9bcbccdda39',
      },
      searchVector: {
        universalIdentifier: '8768a9c0-37c0-4465-b86d-c4c7f466ec23',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-f636-435d-ab8d-e1168b375c71' },
    },
    indexes: {
      taskIdIndex: {
        universalIdentifier: 'c882f7a4-b025-4d32-aa26-5ef2595bdbf9',
      },
      personIdIndex: {
        universalIdentifier: 'b7d305d1-6fae-4ed6-9bdc-354fe9032c0e',
      },
      companyIdIndex: {
        universalIdentifier: 'c0af54c7-751b-4bb2-b102-677cc4e47402',
      },
      opportunityIdIndex: {
        universalIdentifier: '6942e0ba-90f6-4c33-bf40-7f00b1ec35ab',
      },
      trackedDocumentIdIndex: {
        universalIdentifier: '378754d7-ca8b-448e-90e3-8f6861275c81',
      },
      meetingTypeIdIndex: {
        universalIdentifier: '0f4573d9-7655-47eb-b9c7-2e08fb4c84ec',
      },
      chatWidgetIdIndex: {
        universalIdentifier: '04cd88b4-f556-4037-a67b-94ff9bfff20d',
      },
      sequenceIdIndex: {
        universalIdentifier: '4030068c-4695-47ff-8b46-44954b3df3db',
      },
      quoteIdIndex: {
        universalIdentifier: '2c714178-d9b5-4855-93c3-2f1a6aebe672',
      },
    },
    views: {
      allTaskTargets: {
        universalIdentifier: '1dbf1d24-6cca-4f55-ae2f-e3d1b425a495',
        viewFields: {
          id: {
            universalIdentifier: 'a49287c9-8aa6-4fca-9ec5-08d643f7239f',
          },
          task: {
            universalIdentifier: '1f79839e-42f6-4a69-839a-369e21a7497d',
          },
          targetPerson: {
            universalIdentifier: 'cadc7a33-1527-4ef8-ac00-7ed0b54d1bae',
          },
          targetCompany: {
            universalIdentifier: 'e9fa1305-4ba2-41c5-9198-fdc622b69f90',
          },
          targetOpportunity: {
            universalIdentifier: '526f3354-34d6-4e7e-a870-5f99c28353c2',
          },
        },
      },
    },
  },
  timelineActivity: {
    universalIdentifier: '20202020-6736-4337-b5c4-8b39fae325a5',
    fields: {
      id: { universalIdentifier: '20202020-a01a-4081-8a81-9aabbccddeff' },
      createdAt: {
        universalIdentifier: '20202020-a01b-4082-9b82-aabbccddeeff',
      },
      updatedAt: {
        universalIdentifier: '20202020-a01c-4083-8c83-bbccddeeffaa',
      },
      deletedAt: {
        universalIdentifier: '20202020-a01d-4084-9d84-ccddeeffaabb',
      },
      happensAt: {
        universalIdentifier: '20202020-9526-4993-b339-c4318c4d39f0',
      },
      name: { universalIdentifier: '20202020-7207-46e8-9dab-849505ae8497' },
      properties: {
        universalIdentifier: '20202020-f142-4b04-b91b-6a2b4af3bf11',
      },
      workspaceMember: {
        universalIdentifier: '20202020-af23-4479-9a30-868edc474b36',
      },
      targetPerson: {
        universalIdentifier: '20202020-c414-45b9-a60a-ac27aa96229f',
      },
      targetCompany: {
        universalIdentifier: '20202020-04ad-4221-a744-7a8278a5ce21',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-7664-4a35-a3df-580d389fd527',
      },
      targetTask: {
        universalIdentifier: '20202020-b2f5-415c-9135-a31dfe49501b',
      },
      targetNote: {
        universalIdentifier: '20202020-ec55-4135-8da5-3a20badc0156',
      },
      targetWorkflow: {
        universalIdentifier: '20202020-616c-4ad3-a2e9-c477c341e295',
      },
      targetWorkflowVersion: {
        universalIdentifier: '20202020-74f1-4711-a129-e14ca0ecd744',
      },
      targetWorkflowRun: {
        universalIdentifier: '20202020-96f0-401b-9186-a3a0759225ac',
      },
      targetDashboard: {
        universalIdentifier: '20202020-7864-48f5-af7c-9e4b60140948',
      },
      linkedRecordCachedName: {
        universalIdentifier: '20202020-cfdb-4bef-bbce-a29f41230934',
      },
      linkedRecordId: {
        universalIdentifier: '20202020-2e0e-48c0-b445-ee6c1e61687d',
      },
      linkedObjectMetadataId: {
        universalIdentifier: '20202020-c595-449d-9f89-562758c9ee69',
      },
      createdBy: {
        universalIdentifier: '8f66191f-927d-4a6d-a15f-d0ff8cfc5a6d',
      },
      updatedBy: {
        universalIdentifier: '81dc29fc-c872-4efd-bf31-d07872cd260e',
      },
      position: {
        universalIdentifier: 'e245d799-3e4b-4c69-ab9a-6b7c91d71195',
      },
      searchVector: {
        universalIdentifier: 'bc1d1b67-903a-4354-8272-4a6efc4cbe63',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-9a2b-4c3d-a4e5-f6a7b8c9d0e1' },
    },
    indexes: {
      workspaceMemberIdIndex: {
        universalIdentifier: '5e0b2391-85ca-4a66-aef4-52d74245bec2',
      },
      personIdIndex: {
        universalIdentifier: '3e89a914-7bec-47bd-9cf9-743c6b83d001',
      },
      companyIdIndex: {
        universalIdentifier: '8183e8f2-9114-4d6a-8e5f-12c3d14c5c13',
      },
      opportunityIdIndex: {
        universalIdentifier: '9294f9a3-0225-4e7b-9f6a-23d4e25d6d24',
      },
      noteIdIndex: {
        universalIdentifier: '995db1d8-0d3e-40f7-b0eb-5e6897bc9966',
      },
      taskIdIndex: {
        universalIdentifier: '609cf622-86ef-48d1-812b-e1cab610a46c',
      },
      workflowIdIndex: {
        universalIdentifier: 'd6059ec2-92b0-4cfc-9fd8-78050f03108f',
      },
      workflowVersionIdIndex: {
        universalIdentifier: 'd94329b3-5dc8-4141-ae28-31afe28f7135',
      },
      workflowRunIdIndex: {
        universalIdentifier: '1a2bd046-7c23-4e0a-9f8a-c3ca3a16d3b9',
      },
      dashboardIdIndex: {
        universalIdentifier: 'e8821da9-728d-470a-bf5b-5a981fff7880',
      },
    },
    views: {
      allTimelineActivities: {
        universalIdentifier: '20202020-b101-4b01-8b01-ba5cc01aa001',
        viewFields: {
          name: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa011',
          },
          happensAt: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa012',
          },
          properties: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa019',
          },
          workspaceMember: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa013',
          },
          linkedRecordCachedName: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa017',
          },
          targetPerson: {
            universalIdentifier: '37b38a8b-abd7-4f72-92d2-ad82bbef0296',
          },
          targetCompany: {
            universalIdentifier: '2015825f-0786-4b0d-88a7-dfce1b4b1c1a',
          },
          targetOpportunity: {
            universalIdentifier: 'f7b5ced9-eba6-4454-8849-7a92d27c11ca',
          },
          targetTask: {
            universalIdentifier: '3899138d-e6fa-414c-9432-214c9b797ebb',
          },
          targetNote: {
            universalIdentifier: 'ab74ed52-0195-4b65-987a-8367c07ee222',
          },
          targetWorkflow: {
            universalIdentifier: 'd2c3ddc3-afad-40b9-a2cb-d2765f2f5691',
          },
          targetWorkflowVersion: {
            universalIdentifier: '4a7e3213-afd5-4691-8bba-0a10e8697afb',
          },
          targetWorkflowRun: {
            universalIdentifier: '97910946-04f0-4634-804e-880bc0019225',
          },
          targetDashboard: {
            universalIdentifier: '538847e8-ab09-407c-a433-505f6d7be7a1',
          },
        },
      },
    },
  },
  workflow: {
    universalIdentifier: '20202020-62be-406c-b9ca-8caa50d51392',
    fields: {
      id: { universalIdentifier: '20202020-f02a-4181-8a81-efabcdefabcd' },
      createdAt: {
        universalIdentifier: '20202020-f02b-4182-9b82-fabcdefabcde',
      },
      updatedAt: {
        universalIdentifier: '20202020-f02c-4183-8c83-abcdefabcdef',
      },
      deletedAt: {
        universalIdentifier: '20202020-f02d-4184-9d84-bcdefabcdefa',
      },
      name: { universalIdentifier: '20202020-b3d3-478f-acc0-5d901e725b20' },
      lastPublishedVersionId: {
        universalIdentifier: '20202020-326a-4fba-8639-3456c0a169e8',
      },
      statuses: { universalIdentifier: '20202020-357c-4432-8c50-8c31b4a552d9' },
      position: { universalIdentifier: '20202020-39b0-4d8c-8c5f-33c2326deb5f' },
      versions: { universalIdentifier: '20202020-9432-416e-8f3c-27ee3153d099' },
      runs: { universalIdentifier: '20202020-759b-4340-b58b-e73595c4df4f' },
      automatedTriggers: {
        universalIdentifier: '20202020-3319-4234-a34c-117ecad2b8a9',
      },
      favorites: {
        universalIdentifier: '20202020-c554-4c41-be7a-cf9cd4b0d512',
      },
      timelineActivities: {
        universalIdentifier: '20202020-906e-486a-a798-131a5f081faf',
      },
      attachments: {
        universalIdentifier: '20202020-4a8c-4e2d-9b1c-7e5f3a2b4c6d',
      },
      createdBy: {
        universalIdentifier: '20202020-6007-401a-8aa5-e6f48581a6f3',
      },
      updatedBy: {
        universalIdentifier: '3559831e-caf2-4eb5-9db1-b47bf968c774',
      },
      searchVector: {
        universalIdentifier: '20202020-535d-4ffa-b7f3-4fa0d5da1b7a',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: 'c7e64c55-eb0c-4b93-b076-5cfcf2e2e042',
      },
    },
    views: {
      allWorkflows: {
        universalIdentifier: '20202020-a009-4a09-8a09-a0bcf10aa11a',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11a',
          },
          statuses: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11b',
          },
          updatedAt: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11c',
          },
          createdBy: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11d',
          },
          versions: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11e',
          },
          runs: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11f',
          },
        },
      },
    },
  },
  workflowAutomatedTrigger: {
    universalIdentifier: '20202020-3319-4234-a34c-7f3b9d2e4d1f',
    fields: {
      id: {
        universalIdentifier: '20202020-f01a-4171-8a71-abcdefabcdef',
      },
      createdAt: {
        universalIdentifier: '20202020-f01b-4172-9b72-bcdefabcdefa',
      },
      updatedAt: {
        universalIdentifier: '20202020-f01c-4173-8c73-cdefabcdefab',
      },
      deletedAt: {
        universalIdentifier: '20202020-f01d-4174-9d74-defabcdefabc',
      },
      type: {
        universalIdentifier: '20202020-3319-4234-a34c-3f92c1ab56e7',
      },
      settings: {
        universalIdentifier: '20202020-3319-4234-a34c-bac8f903de12',
      },
      workflow: {
        universalIdentifier: '20202020-3319-4234-a34c-8e1a4d2f7c03',
      },
      createdBy: {
        universalIdentifier: '5cea2f46-3779-4782-9fce-3062652e2dfd',
      },
      updatedBy: {
        universalIdentifier: '017d3587-98bd-43ad-b5a6-cb8125105641',
      },
      position: {
        universalIdentifier: 'f4c5eb0a-8a86-49a2-a775-941eaad98fc9',
      },
      searchVector: {
        universalIdentifier: 'dae934ca-bfca-4101-8211-8eae6e2b5513',
      },
    },
    indexes: {
      workflowIdIndex: {
        universalIdentifier: '7331ff89-a3f9-4ac0-9fa9-0de5663ae7b2',
      },
    },
    views: {
      allWorkflowAutomatedTriggers: {
        universalIdentifier: 'a0a9ef79-3d42-417a-8555-3ee54c18ea51',
        viewFields: {
          type: {
            universalIdentifier: '689b4749-aa40-489a-bf0b-475a197ca2e6',
          },
          workflow: {
            universalIdentifier: 'e5a46195-06fe-4f47-8844-128e35151d37',
          },
          createdAt: {
            universalIdentifier: 'bb35e66a-2a1e-416b-8105-5749d91ab65f',
          },
        },
      },
      workflowAutomatedTriggerRecordPageFields: {
        universalIdentifier: '10aff295-f7ac-475d-8528-661eb9aa9759',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'c5261eae-f2fe-416e-8ef9-eda5d377f8ca',
          },
          other: {
            universalIdentifier: 'e6da0410-7f63-41b7-b977-421fc37d67f5',
          },
        },
        viewFields: {
          type: {
            universalIdentifier: '3b3a0cf7-f171-4ad8-9aad-aed84eca0250',
          },
          workflow: {
            universalIdentifier: 'ddc5a9f6-f577-4e4b-a258-3d656c32babc',
          },
          createdAt: {
            universalIdentifier: '98ef45e8-c6bf-42e6-96f6-e94cd17911bc',
          },
          createdBy: {
            universalIdentifier: 'd3933427-de7f-4fa1-b80c-47302273d848',
          },
        },
      },
    },
  },
  workflowRun: {
    universalIdentifier: '20202020-4e28-4e95-a9d7-6c00874f843c',
    fields: {
      id: { universalIdentifier: '20202020-f03a-4191-8a91-cdefabcdefab' },
      createdAt: {
        universalIdentifier: '20202020-f03b-4192-9b92-defabcdefabc',
      },
      updatedAt: {
        universalIdentifier: '20202020-f03c-4193-8c93-efabcdefabcd',
      },
      deletedAt: {
        universalIdentifier: '20202020-f03d-4194-9d94-fabcdefabcde',
      },
      name: { universalIdentifier: '20202020-b840-4253-aef9-4e5013694587' },
      workflowVersion: {
        universalIdentifier: '20202020-2f52-4ba8-8dc4-d0d6adb9578d',
      },
      workflow: {
        universalIdentifier: '20202020-8c57-4e7f-84f5-f373f68e1b82',
      },
      enqueuedAt: {
        universalIdentifier: '20202020-f1e3-4de1-a461-b5c4fdbc861d',
      },
      startedAt: {
        universalIdentifier: '20202020-a234-4e2d-bd15-85bcea6bb183',
      },
      endedAt: { universalIdentifier: '20202020-e1c1-4b6b-bbbd-b2beaf2e159e' },
      status: { universalIdentifier: '20202020-6b3e-4f9c-8c2b-2e5b8e6d6f3b' },
      position: {
        universalIdentifier: '20202020-7802-4c40-ae89-1f506fe3365c',
      },
      createdBy: {
        universalIdentifier: '20202020-6007-401a-8aa5-e6f38581a6f3',
      },
      updatedBy: {
        universalIdentifier: '730dc1c9-34f5-4c22-84a6-bcb55b7604e2',
      },
      state: { universalIdentifier: '20202020-611f-45f3-9cde-d64927e8ec57' },
      favorites: {
        universalIdentifier: '20202020-4baf-4604-b899-2f7fcfbbf90d',
      },
      timelineActivities: {
        universalIdentifier: '20202020-af4d-4eb0-babc-eb960a45b356',
      },
      searchVector: {
        universalIdentifier: '20202020-0b91-4ded-b1ac-cbd5efa58cb9',
      },
    },
    indexes: {
      workflowVersionIdIndex: {
        universalIdentifier: '8183c8d2-9114-4b6e-8c5d-12a3b14a5a14',
      },
      workflowIdIndex: {
        universalIdentifier: '9294d9e3-0225-4c7f-9d6e-23b4c25b6b25',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'e0ac5ad2-d0c8-4f72-b710-8e53b9dc18d9',
      },
    },
    views: {
      allWorkflowRuns: {
        universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abca5',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcaf',
          },
          workflow: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb0',
          },
          status: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb1',
          },
          startedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb2',
          },
          createdBy: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb3',
          },
          workflowVersion: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb4',
          },
        },
      },
      workflowRunRecordPageFields: {
        universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf1',
        viewFields: {
          status: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf6',
          },
          workflow: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf7',
          },
          workflowVersion: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf8',
          },
          startedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf9',
          },
          endedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfa',
          },
          createdAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfb',
          },
          createdBy: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfc',
          },
          enqueuedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfd',
          },
          state: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd01',
          },
          updatedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd02',
          },
          updatedBy: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd03',
          },
          favorites: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd04',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd05',
          },
        },
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf2',
          },
          additional: {
            universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf3',
          },
          other: {
            universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf4',
          },
        },
      },
    },
  },
  workflowVersion: {
    universalIdentifier: '20202020-d65d-4ab9-9344-d77bfb376a3d',
    fields: {
      id: { universalIdentifier: '20202020-f04a-41a1-8aa1-abcdefabcdef' },
      createdAt: {
        universalIdentifier: '20202020-f04b-41a2-9ba2-bcdefabcdefa',
      },
      updatedAt: {
        universalIdentifier: '20202020-f04c-41a3-8ca3-cdefabcdefab',
      },
      deletedAt: {
        universalIdentifier: '20202020-f04d-41a4-9da4-defabcdefabc',
      },
      name: { universalIdentifier: '20202020-a12f-4cca-9937-a2e40cc65509' },
      workflow: {
        universalIdentifier: '20202020-afa3-46c3-91b0-0631ca6aa1c8',
      },
      trigger: {
        universalIdentifier: '20202020-4eae-43e7-86e0-212b41a30b48',
      },
      status: {
        universalIdentifier: '20202020-5a34-440e-8a25-39d8c3d1d4cf',
      },
      position: {
        universalIdentifier: '20202020-791d-4950-ab28-0e704767ae1c',
      },
      runs: { universalIdentifier: '20202020-1d08-46df-901a-85045f18099a' },
      steps: { universalIdentifier: '20202020-5988-4a64-b94a-1f9b7b989039' },
      favorites: {
        universalIdentifier: '20202020-b8e0-4e57-928d-b51671cc71f2',
      },
      timelineActivities: {
        universalIdentifier: '20202020-fcb0-4695-b17e-3b43a421c633',
      },
      searchVector: {
        universalIdentifier: '20202020-3f17-44ef-b8c1-b282ae8469b2',
      },
      createdBy: {
        universalIdentifier: '34f592a7-5c13-4c8b-8473-7bef00848b4e',
      },
      updatedBy: {
        universalIdentifier: '4f8777e6-c5eb-40c6-bb4c-ed9dcf0d81e9',
      },
    },
    indexes: {
      workflowIdIndex: {
        universalIdentifier: '8138c3b3-0b14-4ee1-be0e-debdde6b3219',
      },
      searchVectorGinIndex: {
        universalIdentifier: '6f3a65eb-2aee-4108-b8a0-c62da419d1dc',
      },
    },
    views: {
      allWorkflowVersions: {
        universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aae15',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeaf',
          },
          workflow: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb0',
          },
          status: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb1',
          },
          updatedAt: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb2',
          },
          runs: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb3',
          },
        },
      },
      workflowVersionRecordPageFields: {
        universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef1',
        viewFields: {
          status: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef6',
          },
          workflow: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef7',
          },
          trigger: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef8',
          },
          createdAt: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef9',
          },
          steps: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefa',
          },
          createdBy: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefb',
          },
          updatedAt: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefc',
          },
          updatedBy: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefd',
          },
          runs: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefe',
          },
          favorites: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeff',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaf01',
          },
        },
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef2',
          },
          additional: {
            universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef3',
          },
          other: {
            universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef4',
          },
        },
      },
    },
  },
  workspaceMember: {
    universalIdentifier: '20202020-3319-4234-a34c-82d5c0e881a6',
    fields: {
      id: { universalIdentifier: '20202020-fb1a-41b1-8ab1-efabcdefabcd' },
      createdAt: {
        universalIdentifier: '20202020-fb1b-41b2-9bb2-fabcdefabcde',
      },
      updatedAt: {
        universalIdentifier: '20202020-fb1c-41b3-8cb3-abcdefabcdef',
      },
      deletedAt: {
        universalIdentifier: '20202020-fb1d-41b4-9db4-bcdefabcdefa',
      },
      position: {
        universalIdentifier: '20202020-1810-4591-a93c-d0df97dca843',
      },
      name: { universalIdentifier: '20202020-e914-43a6-9c26-3603c59065f4' },
      colorScheme: {
        universalIdentifier: '20202020-66bc-47f2-adac-f2ef7c598b63',
      },
      locale: {
        universalIdentifier: '20202020-402e-4695-b169-794fa015afbe',
      },
      avatarUrl: {
        universalIdentifier: '20202020-0ced-4c4f-a376-c98a966af3f6',
      },
      userEmail: {
        universalIdentifier: '20202020-4c5f-4e09-bebc-9e624e21ecf4',
      },
      userId: {
        universalIdentifier: '20202020-75a9-4dfc-bf25-2e4b43e89820',
      },
      assignedTasks: {
        universalIdentifier: '20202020-61dc-4a1c-99e8-38ebf8d2bbeb',
      },
      ownedOpportunities: {
        universalIdentifier: '20202020-9e4d-4b3a-8c1f-6d7e8f9a0b1c',
      },
      favorites: {
        universalIdentifier: '20202020-f3c1-4faf-b343-cf7681038757',
      },
      accountOwnerForCompanies: {
        universalIdentifier: '20202020-dc29-4bd4-a3c1-29eafa324bee',
      },
      connectedAccounts: {
        universalIdentifier: '20202020-e322-4bde-a525-727079b4a100',
      },
      messageParticipants: {
        universalIdentifier: '20202020-8f99-48bc-a5eb-edd33dd54188',
      },
      blocklist: {
        universalIdentifier: '20202020-6cb2-4161-9f29-a4b7f1283859',
      },
      calendarEventParticipants: {
        universalIdentifier: '20202020-0dbc-4841-9ce1-3e793b5b3512',
      },
      timelineActivities: {
        universalIdentifier: '20202020-e15b-47b8-94fe-8200e3c66615',
      },
      timeZone: {
        universalIdentifier: '20202020-2d33-4c21-a86e-5943b050dd54',
      },
      dateFormat: {
        universalIdentifier: '20202020-af13-4e11-b1e7-b8cf5ea13dc0',
      },
      timeFormat: {
        universalIdentifier: '20202020-8acb-4cf8-a851-a6ed443c8d81',
      },
      searchVector: {
        universalIdentifier: '20202020-46d0-4e7f-bc26-74c0edaeb619',
      },
      calendarStartDay: {
        universalIdentifier: '20202020-1ecc-4562-84c9-ff3a2f6cce85',
      },
      numberFormat: {
        universalIdentifier: '20202020-7f40-4e7f-b126-11c0eda6b141',
      },
      createdBy: {
        universalIdentifier: '4a3f26d1-033e-4d84-b23a-9adc2fd0c2a8',
      },
      updatedBy: {
        universalIdentifier: '29f84ad0-509f-4aef-9f9c-2691dd60cd87',
      },
    },
    indexes: {
      userEmailUniqueIndex: {
        universalIdentifier: '76da5f27-523c-44b6-ad06-12954f6b949f',
      },
      searchVectorGinIndex: {
        universalIdentifier: '8678dde9-a804-4a9e-80e3-9af35e471ec5',
      },
    },
    views: {
      allWorkspaceMembers: {
        universalIdentifier: '20202020-e001-4e01-8e01-a0bcaeabe100',
        viewFields: {
          name: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f0',
          },
          userEmail: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f1',
          },
          avatarUrl: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f2',
          },
          colorScheme: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f3',
          },
          locale: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f4',
          },
          timeZone: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f5',
          },
          dateFormat: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f6',
          },
          timeFormat: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f7',
          },
          createdAt: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f8',
          },
          ownedOpportunities: {
            universalIdentifier: '8a0503f3-ba61-453e-86dc-6c79f7bc235b',
          },
          assignedTasks: {
            universalIdentifier: 'af16226e-6375-4676-8bd9-9d1a57076fc4',
          },
        },
      },
    },
  },
  campaign: {
    universalIdentifier: 'e3cfc6a7-1db5-4edf-9739-23f776d78e24',
    fields: {
      id: { universalIdentifier: 'fe1c7ef7-c0b0-4b7b-acc2-c14a7f1f93fb' },
      createdAt: {
        universalIdentifier: '6562ccdb-b73a-49c8-aa7d-8bb68a028ee9',
      },
      updatedAt: {
        universalIdentifier: 'b50c3151-0400-4e16-bae3-a6488a2b534b',
      },
      deletedAt: {
        universalIdentifier: '942d1151-a6df-41c1-b967-111b5a0e268f',
      },
      position: {
        universalIdentifier: 'f8689674-0666-4cb5-b53c-f7fe86241149',
      },
      createdBy: {
        universalIdentifier: 'b3b21aea-e21a-4dad-b258-e5b0b5c9e9e5',
      },
      updatedBy: {
        universalIdentifier: '337a27f2-a71a-4df4-accf-36569731ab25',
      },
      name: { universalIdentifier: 'c65727b4-afb8-4e2f-8fe0-84e86eb46ffd' },
      subject: { universalIdentifier: 'e07e5f4a-c4b9-4539-967f-029157c7ab3d' },
      bodyHtml: { universalIdentifier: '90e1070d-1f59-4a14-bd45-0a25e913d47d' },
      status: { universalIdentifier: 'e5c78803-bd3d-437c-b01f-97d074b9b9d5' },
      scheduledDate: {
        universalIdentifier: 'de53af84-c962-4a4d-9574-3a2d3c3e90ca',
      },
      fromEmail: {
        universalIdentifier: 'aee58564-a94e-4ae5-a567-6f2a1bee6163',
      },
      fromName: { universalIdentifier: 'ba674cfa-c0a4-4180-959e-0756cb78972d' },
      recipientCount: {
        universalIdentifier: '9bb6c004-81af-40ff-9988-77508404a56a',
      },
      sentCount: {
        universalIdentifier: '46d7641d-6ab2-4207-95ad-eb42cf1cacc7',
      },
      openCount: {
        universalIdentifier: '0dca2a45-d78c-415c-a2fc-4aef65e17dc6',
      },
      clickCount: {
        universalIdentifier: 'b232621e-471e-4be2-aae3-2fea94601694',
      },
      bounceCount: {
        universalIdentifier: '9f698e01-d3ed-40fa-8eed-c25211f462d6',
      },
      unsubscribeCount: {
        universalIdentifier: '796607d2-1cfa-4866-b88d-4cbd7bc2c202',
      },
      campaignRecipients: {
        universalIdentifier: '199c7d0d-20f8-4751-93c1-867f7deffa8c',
      },
      noteTargets: {
        universalIdentifier: 'ca8b87b5-1045-41d1-98de-8fcf31327702',
      },
      attachments: {
        universalIdentifier: 'a02d9bf3-abca-401c-a9f3-1a0f0a36050b',
      },
      searchVector: {
        universalIdentifier: '33423631-ff9c-4843-bf9c-212fa966387f',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '92f599b2-3c93-4136-900f-11cafdedba56',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'baa8e7c4-63fb-4be2-b0cd-08dc62ce1133',
      },
    },
    views: {
      allCampaigns: {
        universalIdentifier: 'f9de1771-f159-4a68-ba58-d5aac96b254f',
        viewFields: {
          name: {
            universalIdentifier: '5ade71fd-b62b-4b82-8dc8-f97b865b3705',
          },
          status: {
            universalIdentifier: '1e21bd27-b1ba-41da-bdb2-8e9b4f9a5087',
          },
          subject: {
            universalIdentifier: 'e5d1b0f0-b248-4c48-9167-fd519ffcb89f',
          },
          recipientCount: {
            universalIdentifier: '20b6df72-9ef3-4192-a5c7-0b55e5abc2ad',
          },
          sentCount: {
            universalIdentifier: '06942830-9509-4469-a446-88fafb6ecf30',
          },
          openCount: {
            universalIdentifier: '190ff9ee-e084-4a73-92d5-d5acaa75c1bb',
          },
          scheduledDate: {
            universalIdentifier: '5d89896e-e3f5-4d4f-b5ac-808c63793f1a',
          },
          createdAt: {
            universalIdentifier: 'c24649aa-94c4-4012-ab08-8dc7521c1b14',
          },
        },
      },
    },
  },
  campaignRecipient: {
    universalIdentifier: 'bc1a80df-b333-40df-811d-830bcbe77e54',
    fields: {
      id: { universalIdentifier: '7b45577b-b0ef-49c8-8917-3ddcf45e05ec' },
      createdAt: {
        universalIdentifier: '88bc42dc-5a60-42c7-9a19-af5b15d7c505',
      },
      updatedAt: {
        universalIdentifier: '64dd6925-ed88-4b41-8b00-31a6949c911e',
      },
      deletedAt: {
        universalIdentifier: '892a509f-ae42-490f-8119-5df5a905d9b7',
      },
      position: {
        universalIdentifier: '60600c01-b0f1-4cb9-9c88-ac98524dae69',
      },
      createdBy: {
        universalIdentifier: '3bd76c41-98c8-4286-bc9d-816216749b94',
      },
      updatedBy: {
        universalIdentifier: 'c456ee7b-3ad7-4444-ad9b-abfc6d351b10',
      },
      status: { universalIdentifier: '553d9d48-e781-4968-90d5-fd8a0a749442' },
      sentAt: { universalIdentifier: 'e2e7257c-28ab-43de-a195-4f4623c78001' },
      openedAt: { universalIdentifier: 'b31ec792-ccff-4fc4-bf8d-eb0f76f4c051' },
      clickedAt: {
        universalIdentifier: '91fb7875-a218-4f71-83c0-16d7fec1a1b1',
      },
      bouncedAt: {
        universalIdentifier: 'a7c3d2e1-5f8b-4a9c-b6d0-e2f4a8c1d3b5',
      },
      unsubscribedAt: {
        universalIdentifier: '2f1a96cb-4aea-460c-b97b-b400c7410849',
      },
      campaign: { universalIdentifier: '1e0ad613-93a3-4c3e-9250-217d9995ca7d' },
      person: { universalIdentifier: '802d5fe5-0f01-407b-a041-cdfbb7d50e20' },
      searchVector: {
        universalIdentifier: '9efa037b-92f8-400d-b8f0-d4b894a14c2d',
      },
    },
    indexes: {
      campaignIdIndex: {
        universalIdentifier: '5730beec-91ef-4290-ac19-0cdbfd2c6a3b',
      },
      personIdIndex: {
        universalIdentifier: 'ba972b44-418f-4d02-b07e-8cec25f4b8dd',
      },
      statusIndex: {
        universalIdentifier: '41636c1b-1ee6-4390-bac0-965725279e64',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'e1f26e80-238e-4a35-905f-191784d2e986',
      },
    },
    views: {
      campaignRecipientRecordPageFields: {
        universalIdentifier: 'f4c3a120-8e4d-4b91-a6f7-3c8e5d9b2a01',
        viewFields: {
          status: {
            universalIdentifier: 'b8d2e4f6-1a3c-4d7e-9f0b-2c4d6e8a0b1c',
          },
          person: {
            universalIdentifier: '77c65290-c889-4b07-bf18-145a0d2ba4a4',
          },
          sentAt: {
            universalIdentifier: 'aec67cc8-d85f-417d-9561-dc678df558ff',
          },
        },
      },
    },
  },
  campaignTemplate: {
    universalIdentifier: '035a0ef3-9db0-4cb0-ab9d-5284eef6135a',
    fields: {
      id: { universalIdentifier: '9fb590e9-3026-43ed-a184-67a73c7ad72b' },
      createdAt: {
        universalIdentifier: '5e8a0652-58fb-4578-ba7e-643122a7cd98',
      },
      updatedAt: {
        universalIdentifier: '270b14e9-b129-4cd9-a5b2-e54bb9ffcef6',
      },
      deletedAt: {
        universalIdentifier: '0fcbbdf6-2880-42c9-9804-3956d67c867d',
      },
      position: {
        universalIdentifier: '9f2c0c1f-7e75-4f41-89f5-1fc8d15903fe',
      },
      createdBy: {
        universalIdentifier: 'e0153c77-a9e3-4aca-97e0-b49dae7c539d',
      },
      updatedBy: {
        universalIdentifier: '82a08fa1-3a57-4d76-a51d-b0f7ccdd01f6',
      },
      name: { universalIdentifier: 'ccd25c91-5fc0-4636-a402-c890293aa0f2' },
      subject: { universalIdentifier: 'dc533313-4b94-4494-bf08-cad55d871ca5' },
      bodyHtml: { universalIdentifier: '0c7f444d-74b2-4920-a11a-ff8db5a67eca' },
      category: { universalIdentifier: '35beb917-f001-4ac1-8514-a16bff0c5478' },
      thumbnailUrl: {
        universalIdentifier: '1a2d987e-e86c-4584-98ad-f1af52a0cccf',
      },
      searchVector: {
        universalIdentifier: '72bef722-f37a-4f30-baa0-ae278ba6849e',
      },
    },
    indexes: {
      categoryIndex: {
        universalIdentifier: 'd79cef23-da2d-4129-9ee8-12c9aece2b97',
      },
      searchVectorGinIndex: {
        universalIdentifier: '4691fbda-6816-467d-bab3-51b0cbb36078',
      },
    },
    views: {
      allCampaignTemplates: {
        universalIdentifier: 'e7547264-5021-4030-861b-65c64951423d',
        viewFields: {
          name: {
            universalIdentifier: 'a0abbf02-c89e-48d3-b9c3-b156de3138ec',
          },
        },
      },
    },
  },
  dripCampaign: {
    universalIdentifier: '6035f470-bbcf-4213-8080-9de63ba54fee',
    fields: {
      id: { universalIdentifier: '4048907b-fc15-4043-a93c-e3609615dcc3' },
      createdAt: {
        universalIdentifier: 'b77cb761-5e0c-45ce-852c-01866e36848b',
      },
      updatedAt: {
        universalIdentifier: '115a9ab9-7728-4d6f-ab86-11683f1bd6eb',
      },
      deletedAt: {
        universalIdentifier: 'a9a5bc31-de3c-411e-8b28-f9e1871f1ed3',
      },
      position: {
        universalIdentifier: '6c401a38-7582-488b-b395-06fa752e1e37',
      },
      createdBy: {
        universalIdentifier: 'bef2f17a-c6e0-43d9-a51d-f91d566b5118',
      },
      updatedBy: {
        universalIdentifier: '45e9b049-1fb5-4843-9515-a2e566aaa5ca',
      },
      name: { universalIdentifier: '4bae1a7c-75d2-4b27-935c-3b265afba262' },
      status: {
        universalIdentifier: '82caf219-ba71-45f4-b53c-571c4f0e7946',
      },
      workflowId: {
        universalIdentifier: 'a497039c-827a-4fbc-a890-86383084daf0',
      },
      enrollmentCount: {
        universalIdentifier: '3618098b-434a-4727-a1cf-21e58c6b52e1',
      },
      activeEnrollmentCount: {
        universalIdentifier: '67546213-1696-4b5a-8a46-3c24be323e89',
      },
      completedCount: {
        universalIdentifier: '0547f4e3-376b-41ce-9cdb-d63f06d612f6',
      },
      dripEnrollments: {
        universalIdentifier: '4a6d8308-681f-46a1-8a27-f97e0808dda4',
      },
      searchVector: {
        universalIdentifier: '6cdec635-20df-4827-b33c-7757356d4e10',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '25d31570-0e59-4b0d-b5cf-6129848c4fbc',
      },
      searchVectorGinIndex: {
        universalIdentifier: '9833f491-14ee-4b97-9c39-6f2ca49a1809',
      },
    },
    views: {
      allDripCampaigns: {
        universalIdentifier: 'db56bd3b-b53f-4bd0-aa16-40e6ed62c105',
        viewFields: {
          name: {
            universalIdentifier: 'c8795cec-f630-456a-b531-5a82fe90d790',
          },
          status: {
            universalIdentifier: 'c3918fd8-a076-4070-9c9e-9a97872e1193',
          },
          enrollmentCount: {
            universalIdentifier: 'b2ce0ada-c90c-4090-82ae-6e9a25d0a966',
          },
          activeEnrollmentCount: {
            universalIdentifier: 'a6ba5e9a-f431-45de-a62a-ece7f612af5c',
          },
          completedCount: {
            universalIdentifier: '32ca15a4-baf6-4f58-81b1-50f70e4ed5ef',
          },
          createdAt: {
            universalIdentifier: 'f06442d8-cb2f-4527-8710-f6de5487eb89',
          },
        },
      },
    },
  },
  dripEnrollment: {
    universalIdentifier: '2453434e-fb4f-464f-814d-995d4ac5ca25',
    fields: {
      id: { universalIdentifier: '7df9fa61-693e-4089-be33-aa2230dea0cf' },
      createdAt: {
        universalIdentifier: '8f308c4c-344a-4a92-8387-966cd628e921',
      },
      updatedAt: {
        universalIdentifier: '98e79460-0a66-4b12-81d6-cd2a24d14cb6',
      },
      deletedAt: {
        universalIdentifier: 'e7f5df58-5edb-43bd-94b7-c5224303d94c',
      },
      position: {
        universalIdentifier: 'fcc7b8de-fc81-483f-b969-d4dec5fd5c48',
      },
      createdBy: {
        universalIdentifier: '45f92a56-56e0-41c7-90d6-f85460cd2ef3',
      },
      updatedBy: {
        universalIdentifier: 'c142409e-0118-4c83-bd27-7f927e91e0fe',
      },
      status: {
        universalIdentifier: '4b64e58b-c055-4555-b8c6-6e4287563f3a',
      },
      currentStepIndex: {
        universalIdentifier: 'f49424a8-9174-4e8b-bf6a-979376f71473',
      },
      enrolledAt: {
        universalIdentifier: 'd5a5bcb4-a2af-4b7a-a989-0491344bbfcc',
      },
      completedAt: {
        universalIdentifier: '44af0f4a-c247-4c0e-9ba4-95811d675bb9',
      },
      workflowRunId: {
        universalIdentifier: '19d9ebc5-dde1-4450-8557-dbbedc0954f6',
      },
      dripCampaign: {
        universalIdentifier: '8fd3336a-6202-4445-b578-ea5996824696',
      },
      person: {
        universalIdentifier: '3b2f4207-8cee-4f42-b3f8-ab3872047069',
      },
      searchVector: {
        universalIdentifier: '92e8cec3-4104-4d13-a19e-23aab62fd08e',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: '430a768f-5efe-4a74-8964-c259d7d54175',
      },
    },
    views: {
      dripEnrollmentRecordPageFields: {
        universalIdentifier: 'fd2fc93b-71e9-42ca-b53d-332eba838b8b',
        viewFields: {
          status: {
            universalIdentifier: 'f726d104-e6c5-4a73-99a2-dacb0b0a788a',
          },
          dripCampaign: {
            universalIdentifier: '1237012b-1463-451e-bf67-c26b3d1f730e',
          },
          enrolledAt: {
            universalIdentifier: '17fc6057-ddb2-4669-a667-434f4016730a',
          },
        },
      },
    },
  },
  form: {
    universalIdentifier: 'cd5a922c-d024-42cb-8985-ee987c37ed1b',
    fields: {
      id: { universalIdentifier: 'af749a8e-9f65-40b7-a325-1314e3807320' },
      createdAt: {
        universalIdentifier: 'bce69619-729a-4b86-a6fd-6630b3b0176d',
      },
      updatedAt: {
        universalIdentifier: '285429dd-abf5-4d5d-b823-dd32d4ecdb66',
      },
      deletedAt: {
        universalIdentifier: 'c79a0b30-ed42-4758-8c5e-0de92c9e2ff8',
      },
      position: {
        universalIdentifier: '35887568-21c9-4246-817f-24ff8da90e45',
      },
      createdBy: {
        universalIdentifier: 'b9dad1b7-18d8-4eec-9dcb-5fab03643763',
      },
      updatedBy: {
        universalIdentifier: '1cf7b003-1511-4e48-82d3-cd280150b476',
      },
      name: { universalIdentifier: '46235b5c-00de-4cb3-9eee-91290bbb16fb' },
      description: {
        universalIdentifier: '8737d4f6-c76f-4b59-830c-919dd56b8dec',
      },
      status: { universalIdentifier: '74f2a0a6-22c0-47c7-9ef6-9919dc07dcfa' },
      fieldsConfig: {
        universalIdentifier: '85cdb09c-9e43-4d7a-8bf8-c86436a0ebba',
      },
      submissionCount: {
        universalIdentifier: '3b53f50b-93c3-45bd-a739-26fee02dcd7d',
      },
      thankYouMessage: {
        universalIdentifier: 'a4052977-1ea4-4d91-8726-ce11f5cd3957',
      },
      notifyOnSubmission: {
        universalIdentifier: 'fe7ac387-588e-4ee5-91d3-8b473674e3e1',
      },
      notificationEmail: {
        universalIdentifier: '3c62ae05-1eaa-4c14-bc49-2969e88c2713',
      },
      redirectUrl: {
        universalIdentifier: '7d4e8f1a-2b3c-4d5e-9f6a-1b2c3d4e5f6a',
      },
      sendConfirmationEmail: {
        universalIdentifier: '8e5f9a2b-3c4d-4e6f-a7b8-2c3d4e5f6a7b',
      },
      confirmationEmailSubject: {
        universalIdentifier: '3a3cf51d-014b-4a04-ab77-63a86206dc98',
      },
      confirmationEmailBody: {
        universalIdentifier: '183bb2d0-deff-46c0-8b28-82a1a6a35ae0',
      },
      formSubmissions: {
        universalIdentifier: 'd4fc6edb-094e-457a-9050-091fd88fa25b',
      },
      searchVector: {
        universalIdentifier: 'dc07086f-6429-4e5c-944b-26c4ca6656f8',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: 'e7fbcf2c-a8c8-40e2-bf7c-db012c8da9b4',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'e12e20d1-a714-44d9-8323-50e8ab8037df',
      },
    },
    views: {
      allForms: {
        universalIdentifier: '60e6f646-f80f-4cc5-b9be-937fd9274a2c',
        viewFields: {
          name: {
            universalIdentifier: 'fcb045e2-3a4b-4d2f-be27-01343622d267',
          },
          status: {
            universalIdentifier: 'b30cae56-ee34-4812-abb4-d4967873185a',
          },
          description: {
            universalIdentifier: '98438104-c9fc-4428-bf83-15c0af5e4542',
          },
          submissionCount: {
            universalIdentifier: '932a9c0b-23f6-41b7-97a2-adc5f5693926',
          },
          createdAt: {
            universalIdentifier: 'ee562f40-ea98-45c7-bf35-84dfa58f6a22',
          },
        },
      },
    },
  },
  formSubmission: {
    universalIdentifier: '27edc48c-6729-4e5e-b381-f55d0a47c6a6',
    fields: {
      id: { universalIdentifier: 'a92a155e-c2a4-48b0-bdb2-204d49c85486' },
      createdAt: {
        universalIdentifier: '7f62588c-56cb-4b06-be31-971cba4b200c',
      },
      updatedAt: {
        universalIdentifier: 'eb8c1734-c486-40fb-ae71-32401111efb8',
      },
      deletedAt: {
        universalIdentifier: '57b10d43-c4c4-4353-9a3a-b0e42e3408b6',
      },
      position: {
        universalIdentifier: '7e65c5f4-3e89-4536-ad91-64671520d5d8',
      },
      createdBy: {
        universalIdentifier: '142f0cf0-7947-44ef-9b37-251c1a2e8ab0',
      },
      updatedBy: {
        universalIdentifier: '45afa911-6887-45f2-b895-b2424f54e3fc',
      },
      data: { universalIdentifier: 'fc79e781-f091-42c2-8c30-59c53998e4ea' },
      submitterEmail: {
        universalIdentifier: 'dc522ff0-8f25-419e-966e-e183ac4ea671',
      },
      submitterName: {
        universalIdentifier: '299a3829-c7d9-4a3d-ac4e-34ea25e490ea',
      },
      source: { universalIdentifier: '5174f39c-3bd7-4214-b7b0-364d762306d6' },
      form: { universalIdentifier: '00ae8240-3fc9-4b30-a9ff-dd7c875e7f45' },
      searchVector: {
        universalIdentifier: 'b950318b-1b20-4c8d-b2bf-e54a7dd61275',
      },
    },
    indexes: {
      formIdIndex: {
        universalIdentifier: 'bf0959ec-bfa7-49cd-83ab-555511f162c3',
      },
      searchVectorGinIndex: {
        universalIdentifier: '1ccd7fa5-254f-454f-8aa6-c3a1ab91b25e',
      },
    },
    views: {
      allFormSubmissions: {
        universalIdentifier: 'b61f44e0-7671-4c2f-adc5-d62f7d4a7f83',
        viewFields: {
          submitterEmail: {
            universalIdentifier: '57977887-2632-43d0-9407-7ce6a5dde810',
          },
          submitterName: {
            universalIdentifier: '45a28151-02f2-48a6-a17a-e19cf8e9b45d',
          },
          source: {
            universalIdentifier: '5b4c3cd9-c7a6-4e53-9ba4-68aa8eb5809a',
          },
          form: {
            universalIdentifier: '867a817a-a3db-4e27-bec8-02fc9b0456cb',
          },
          createdAt: {
            universalIdentifier: 'a827ab7c-96b9-4e1c-8974-cbc35d7f561d',
          },
        },
      },
    },
  },
  landingPage: {
    universalIdentifier: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    fields: {
      id: { universalIdentifier: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e' },
      createdAt: {
        universalIdentifier: '41ecfe3d-1115-436d-97cb-49fc2f05d9a4',
      },
      updatedAt: {
        universalIdentifier: 'c1e67cf6-60c5-4ff3-b248-a39282338a6c',
      },
      deletedAt: {
        universalIdentifier: 'c9037a51-8440-4aa4-acbd-ba2a5aa62364',
      },
      position: {
        universalIdentifier: 'b2415df0-6e5b-4912-9a59-91ed9ac9706a',
      },
      createdBy: {
        universalIdentifier: '10ac2812-74c9-425d-a465-8549bdd80d8a',
      },
      updatedBy: {
        universalIdentifier: '7d3de715-0638-41d6-903d-0268e3b7a46e',
      },
      title: {
        universalIdentifier: '38b2b528-ea0b-4029-b69c-78f6bcaa97e3',
      },
      slug: {
        universalIdentifier: '58670611-06ab-418d-91b4-f0f19865a594',
      },
      status: {
        universalIdentifier: 'e1f2a3b4-c5d6-4e7f-8091-a2b3c4d5e6f7',
      },
      sectionsConfig: {
        universalIdentifier: 'f2a3b4c5-d6e7-4f80-91a2-b3c4d5e6f7a8',
      },
      metaTitle: {
        universalIdentifier: 'a3b4c5d6-e7f8-4091-a2b3-c4d5e6f7a8b9',
      },
      metaDescription: {
        universalIdentifier: 'b4c5d6e7-f809-41a2-b3c4-d5e6f7a8b9c0',
      },
      headerConfig: {
        universalIdentifier: '9d47a710-6eb7-4063-beff-0ad626a45739',
      },
      footerConfig: {
        universalIdentifier: '7670ebe0-1ada-4406-8e9c-04dd92e872d3',
      },
      viewCount: {
        universalIdentifier: '25459ac5-755e-43cd-97a8-ecd957672c48',
      },
      searchVector: {
        universalIdentifier: '13dcfd26-6eec-4ba3-a5be-e4aa238e9286',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '091a2b3c-4d5e-46f7-a8b9-c0d1e2f3a4b5',
      },
      slugIndex: {
        universalIdentifier: '1a2b3c4d-5e6f-47a8-b9c0-d1e2f3a4b5c6',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'b7e13ed6-a0ed-409d-98bb-f71cf4aa6262',
      },
    },
    views: {
      allLandingPages: {
        universalIdentifier: '02e54dd8-d097-4c7f-9f57-5de091186396',
        viewFields: {
          title: {
            universalIdentifier: '9a202704-69cb-4826-ac32-fa0722153c27',
          },
          slug: {
            universalIdentifier: '6cdc675a-2fb2-437f-85a2-e44f4875ab39',
          },
          status: {
            universalIdentifier: '6f7a8b9c-0d1e-42f3-a4b5-c6d7e8f90a1b',
          },
          viewCount: {
            universalIdentifier: '7a8b9c0d-1e2f-43a4-b5c6-d7e8f90a1b2c',
          },
          createdAt: {
            universalIdentifier: '364e4576-2259-4fcd-adde-2e458258a178',
          },
        },
      },
    },
  },
  trackedDocument: {
    universalIdentifier: '73368b94-ffef-43b5-b262-2f15011b3334',
    fields: {
      id: { universalIdentifier: 'e7e1e668-4781-4fa0-8ac2-98acbe907e4b' },
      createdAt: {
        universalIdentifier: 'd555d5c7-38a3-4645-b748-928d4e0f95da',
      },
      updatedAt: {
        universalIdentifier: 'e76dc2d6-d454-4260-b812-5a0e1e72eecb',
      },
      deletedAt: {
        universalIdentifier: '68c6d2e0-9650-46e2-a163-2f6daa13b1b7',
      },
      position: {
        universalIdentifier: '5a4bedd2-a7ad-42eb-bfc2-de258748253d',
      },
      createdBy: {
        universalIdentifier: 'af39664e-b5c1-445a-865b-74f74bec5d4c',
      },
      updatedBy: {
        universalIdentifier: 'ac1e610b-2d19-4ce5-8efb-be006c6c2736',
      },
      name: { universalIdentifier: 'dc1e1584-7c0b-49f3-be2a-448be80bbe32' },
      description: {
        universalIdentifier: 'cf43b81a-5bc9-4a93-ac2a-b8699a927d96',
      },
      mimeType: {
        universalIdentifier: '4f0baa1a-392e-4f3d-97b8-6d0327c9b166',
      },
      pageCount: {
        universalIdentifier: 'f699313d-22a7-43e7-b335-50fb5de65713',
      },
      status: { universalIdentifier: '6668f9ca-ad48-46a4-a8e8-0bba09257430' },
      requireEmail: {
        universalIdentifier: '9b8bafca-a3f6-4818-9d5c-347c9ec5d125',
      },
      enableDownload: {
        universalIdentifier: '2cb7766e-ba79-4d0a-b650-e926ff26fba9',
      },
      expiresAt: {
        universalIdentifier: '9f3f228a-7ba0-48cb-b8c8-7e566e1c7ba6',
      },
      viewCount: {
        universalIdentifier: '07eae700-9744-446c-b015-64e5f65a1661',
      },
      uniqueViewerCount: {
        universalIdentifier: 'f36b7fe5-3c14-4ebd-ac19-b2f6415b6529',
      },
      notifyOnView: {
        universalIdentifier: '10a5ce6b-cd15-4d2f-a436-07124aaf9c39',
      },
      notificationEmail: {
        universalIdentifier: '5a019c7f-7cd0-4706-92ca-3f5a1d215f04',
      },
      sharingLinks: {
        universalIdentifier: '6de90a77-8574-47eb-ac12-01723d97314c',
      },
      documentViews: {
        universalIdentifier: '945c9698-7f12-4f86-83ab-172dde955e1f',
      },
      searchVector: {
        universalIdentifier: '7886d7dc-ecbc-4ce9-8364-874d2a81826a',
      },
      noteTargets: {
        universalIdentifier: '3e0e3c40-188e-4160-96e2-b58f7b66c13e',
      },
      taskTargets: {
        universalIdentifier: '53bbe4d1-b1bb-418e-b71b-8c07f5ef6ddf',
      },
      attachments: {
        universalIdentifier: '4ce63bf2-98d2-499e-9767-63212730265b',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: 'fc94e077-ddf9-44c0-afda-da4592c283bb',
      },
      searchVectorGinIndex: {
        universalIdentifier: '555d9500-81f9-4f97-9784-680c48f41a96',
      },
    },
    views: {
      allDocuments: {
        universalIdentifier: '1f0e8b5b-2bf8-4322-b247-0db5c6cb2077',
        viewFields: {
          name: {
            universalIdentifier: 'bea43220-ecf5-4aad-9361-5d3e6ff01c65',
          },
          status: {
            universalIdentifier: '8b45042e-7bb6-46e0-bd3c-49b62eb0683b',
          },
          viewCount: {
            universalIdentifier: '7144c7e4-088d-4d6a-94b0-63a7293df0c5',
          },
          uniqueViewerCount: {
            universalIdentifier: '6e1cd3e1-df89-4ec0-87eb-724fa3a9447e',
          },
          createdAt: {
            universalIdentifier: '7617ffe9-f324-4047-bda6-f4ec9bec7e8a',
          },
        },
      },
    },
  },
  documentSharingLink: {
    universalIdentifier: '2f59d8d8-8262-449c-a3e4-69f6be78e323',
    fields: {
      id: { universalIdentifier: 'a38020ae-1160-4bc2-9ed1-88ca7ac4c32b' },
      createdAt: {
        universalIdentifier: '3602616f-1d0c-4581-b492-0b2a5b32b9fb',
      },
      updatedAt: {
        universalIdentifier: '9fa5cecf-bff6-4011-8671-58c5d5c64935',
      },
      deletedAt: {
        universalIdentifier: '04d7ebb9-3f80-4bb3-8cbf-d736614ab3de',
      },
      position: {
        universalIdentifier: 'db0825b2-e0e2-42d4-a5f2-13f9e7532a48',
      },
      createdBy: {
        universalIdentifier: '1b630203-b3c7-4223-b4d8-8d4c22aa00df',
      },
      updatedBy: {
        universalIdentifier: 'bdc45411-585a-4870-a5ec-418c9a70d694',
      },
      slug: { universalIdentifier: '85e1803e-9c19-4bac-bfa0-6925c9363ba1' },
      isActive: {
        universalIdentifier: '3147ccba-f9d2-4a96-9433-41c0165d6a98',
      },
      recipientEmail: {
        universalIdentifier: 'd4a44300-f534-4da1-88a8-c5ffa1d0e1e4',
      },
      viewCount: {
        universalIdentifier: '5fa96174-99a1-4658-b375-f75efa95ae5d',
      },
      trackedDocument: {
        universalIdentifier: '9bf7bd5c-0774-4eb7-bc06-ff8a54d59c61',
      },
      person: { universalIdentifier: '625547e3-0fd6-4d26-97d8-5fe4dcfe82a7' },
      targetQuote: {
        universalIdentifier: '58e0aa88-debe-4918-bda2-2e1279d367f8',
      },
      targetType: {
        universalIdentifier: '1a9a2e09-e7d6-4b8f-b216-1b9dc89bdcb5',
      },
      documentViews: {
        universalIdentifier: '077b9a6e-e669-4b45-84ac-29c201a50004',
      },
      searchVector: {
        universalIdentifier: '26682ee9-b02d-4bd4-b689-2f40610f975b',
      },
    },
    indexes: {
      trackedDocumentIdIndex: {
        universalIdentifier: '0c15eb97-af45-4156-9707-0a736f90c6d4',
      },
      quoteIdIndex: {
        universalIdentifier: '6a98276c-fbcf-4759-a9c5-25ccd106b0bc',
      },
      searchVectorGinIndex: {
        universalIdentifier: '1c77a4fe-ea59-459e-b601-b368ff4028e4',
      },
    },
    views: {
      allDocumentSharingLinks: {
        universalIdentifier: '43cb6775-ba40-4b7a-afa0-f07f6def8a39',
        viewFields: {
          slug: {
            universalIdentifier: 'bcbf101a-74fb-4c53-ad45-3033aa8340ba',
          },
          isActive: {
            universalIdentifier: '8dedd5c3-fd7f-4676-afd9-7e5981825fdf',
          },
          recipientEmail: {
            universalIdentifier: 'e3211575-cb33-43f2-9780-aaac002ddab5',
          },
          viewCount: {
            universalIdentifier: '65ae2a08-e24f-498b-aff4-27c557e31f75',
          },
          createdAt: {
            universalIdentifier: '918443fc-69fd-4aba-b291-305b16b72ab2',
          },
        },
      },
    },
  },
  documentView: {
    universalIdentifier: 'e4e742e5-120a-49c3-a043-aef9708a8a95',
    fields: {
      id: { universalIdentifier: 'aa298bad-5094-48d3-b5ca-d76c15fd9c68' },
      createdAt: {
        universalIdentifier: '8ccfd00a-c2c5-4d2b-887a-805e8e01f97d',
      },
      updatedAt: {
        universalIdentifier: 'dc7664a8-6265-444f-b277-2d7c5c4ca78c',
      },
      deletedAt: {
        universalIdentifier: '181fe53d-21e0-48ab-b614-d659348a959a',
      },
      viewerEmail: {
        universalIdentifier: 'd8f0fab2-8503-4935-90d1-dc49365b9ba7',
      },
      viewerName: {
        universalIdentifier: '8a0759fd-9fd2-45b5-9d9f-758f2cac9319',
      },
      viewedAt: {
        universalIdentifier: '1a62afd1-cfc3-486c-9979-bf2cbd2ceb97',
      },
      durationSeconds: {
        universalIdentifier: '678917bb-48c6-481f-8768-0c63167a4344',
      },
      pagesViewed: {
        universalIdentifier: 'f715813c-8761-436c-b793-e92b380c78e7',
      },
      completionPercent: {
        universalIdentifier: '1551108b-cd1c-4f61-b18d-618ebb965e13',
      },
      trackedDocument: {
        universalIdentifier: '87a0dcfe-45b5-4b10-87bd-ee926323fee6',
      },
      documentSharingLink: {
        universalIdentifier: '37a44367-ad00-4d8a-ab29-f57750ff3aeb',
      },
      person: { universalIdentifier: '6b6ee49c-d01c-4645-97c0-cb1e893041b4' },
      createdBy: {
        universalIdentifier: 'd33c8658-37c6-4ca8-b20f-3591aa030beb',
      },
      updatedBy: {
        universalIdentifier: 'e8845ebe-4309-47d1-a082-ae74ee249eea',
      },
      position: {
        universalIdentifier: '8e6ed8e9-ea21-49a0-92cd-6cd08f606f77',
      },
      searchVector: {
        universalIdentifier: '4e7cde6e-545b-4e34-8645-a947ff133016',
      },
    },
    indexes: {
      trackedDocumentIdIndex: {
        universalIdentifier: 'f98b4d05-49a6-440d-bdc2-fe590308f1ae',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'd5ae3ff5-91fa-42bd-a05f-772f447b39a1',
      },
    },
    views: {
      allDocumentViews: {
        universalIdentifier: 'ddce8db5-942c-4cef-bb9d-45b2a466badd',
        viewFields: {
          viewerEmail: {
            universalIdentifier: '6d28d9d4-dd1e-42ea-91f7-060e2b82dab9',
          },
          viewerName: {
            universalIdentifier: '04dc127d-9556-4c35-9359-ad334d6626c0',
          },
          viewedAt: {
            universalIdentifier: '257c74a7-eeb5-441a-bef4-5fd7a2bd393a',
          },
          durationSeconds: {
            universalIdentifier: 'e963ed5c-f86a-47bb-96c2-b21779d6c19a',
          },
          completionPercent: {
            universalIdentifier: '36b4bd53-c229-4ead-9900-252d0f4210d0',
          },
        },
      },
    },
  },
  meetingType: {
    universalIdentifier: 'b7a1c2d3-e4f5-4a6b-8c9d-0e1f2a3b4c5d',
    fields: {
      id: { universalIdentifier: 'c8b2d3e4-f5a6-4b7c-9d0e-1f2a3b4c5d6e' },
      createdAt: {
        universalIdentifier: 'd9c3e4f5-a6b7-4c8d-8e1f-2a3b4c5d6e7f',
      },
      updatedAt: {
        universalIdentifier: 'e0d4f5a6-b7c8-4d9e-9f20-3a4b5c6d7e8f',
      },
      deletedAt: {
        universalIdentifier: 'f1e5a6b7-c8d9-4e0f-a031-4a5b6c7d8e9f',
      },
      position: {
        universalIdentifier: 'a2f6b7c8-d9e0-4f10-b142-5a6b7c8d9e0f',
      },
      createdBy: {
        universalIdentifier: 'b3a7c8d9-e0f1-4021-8253-6a7b8c9d0e1f',
      },
      updatedBy: {
        universalIdentifier: 'c4b8d9e0-f102-4132-9364-7a8b9c0d1e2f',
      },
      name: { universalIdentifier: 'd5c9e0f1-0213-4243-a475-8a9b0c1d2e3f' },
      slug: { universalIdentifier: 'e6d0f102-1324-4354-b586-9a0b1c2d3e4f' },
      description: {
        universalIdentifier: '82dcce94-fd81-4c70-8542-ba238e9bb196',
      },
      durationMinutes: {
        universalIdentifier: 'f7e10213-2435-4465-8697-0a1b2c3d4e5f',
      },
      bufferBeforeMinutes: {
        universalIdentifier: 'a8f21324-3546-4576-97a8-1a2b3c4d5e6f',
      },
      bufferAfterMinutes: {
        universalIdentifier: 'b9032435-4657-4687-a8b9-2a3b4c5d6e7f',
      },
      status: { universalIdentifier: 'c0143546-5768-4798-b9c0-3a4b5c6d7e8f' },
      availabilityConfig: {
        universalIdentifier: 'd1254657-6879-4809-80d1-4a5b6c7d8e9f',
      },
      timezone: {
        universalIdentifier: 'e2365768-7980-4910-91e2-5a6b7c8d9e0f',
      },
      location: {
        universalIdentifier: 'f3476879-8091-4021-a2f3-6a7b8c9d0e1f',
      },
      confirmationMessage: {
        universalIdentifier: 'a4587980-9102-4132-b304-7a8b9c0d1e2f',
      },
      notifyOnBooking: {
        universalIdentifier: 'b5698091-0213-4243-8415-8a9b0c1d2e3f',
      },
      notificationEmail: {
        universalIdentifier: 'c6709102-1324-4354-9526-9a0b1c2d3e4f',
      },
      color: { universalIdentifier: 'd7810213-2435-4465-a637-0a1b2c3d4e5f' },
      bookingCount: {
        universalIdentifier: 'e8921324-3546-4576-b748-1a2b3c4d5e6f',
      },
      bookings: {
        universalIdentifier: 'f9032435-4657-4687-8859-2a3b4c5d6e7f',
      },
      searchVector: {
        universalIdentifier: 'a0143546-5768-4798-9960-3a4b5c6d7e8f',
      },
      noteTargets: {
        universalIdentifier: '1db54386-9883-4236-825e-639e035cbcc4',
      },
      taskTargets: {
        universalIdentifier: 'd8f03731-218e-43e9-8d4c-cd4eaeb30d7d',
      },
      attachments: {
        universalIdentifier: 'd2505c5d-a3c7-4d81-b842-58f5e52e1743',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: 'b1254657-6879-4809-a071-4a5b6c7d8e9f',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'c2365768-7980-4910-b182-5a6b7c8d9e0f',
      },
    },
    views: {
      allMeetingTypes: {
        universalIdentifier: 'd3476879-8091-4021-8293-6a7b8c9d0e1f',
        viewFields: {
          name: {
            universalIdentifier: 'e4587980-9102-4132-93a4-7a8b9c0d1e2f',
          },
          status: {
            universalIdentifier: 'f5698091-0213-4243-a4b5-8a9b0c1d2e3f',
          },
          durationMinutes: {
            universalIdentifier: 'a6709102-1324-4354-b5c6-9a0b1c2d3e4f',
          },
          bookingCount: {
            universalIdentifier: 'b7810213-2435-4465-86d7-0a1b2c3d4e5f',
          },
          createdAt: {
            universalIdentifier: 'c8921324-3546-4576-97e8-1a2b3c4d5e6f',
          },
        },
      },
    },
  },
  booking: {
    universalIdentifier: 'a4b5c6d7-e8f9-4a0b-9c2d-3e4f5a6b7c8d',
    fields: {
      id: { universalIdentifier: 'b5c6d7e8-f9a0-4b1c-ad3e-4f5a6b7c8d9e' },
      createdAt: {
        universalIdentifier: 'c6d7e8f9-a0b1-4c2d-be4f-5a6b7c8d9e0f',
      },
      updatedAt: {
        universalIdentifier: 'd7e8f9a0-b1c2-4d3e-8f50-6a7b8c9d0e1f',
      },
      deletedAt: {
        universalIdentifier: 'e8f9a0b1-c2d3-4e4f-9061-7a8b9c0d1e2f',
      },
      position: {
        universalIdentifier: 'f9a0b1c2-d3e4-4f50-a172-8a9b0c1d2e3f',
      },
      createdBy: {
        universalIdentifier: 'a0b1c2d3-e4f5-4061-b283-9a0b1c2d3e4f',
      },
      updatedBy: {
        universalIdentifier: 'b1c2d3e4-f506-4172-8394-0a1b2c3d4e5f',
      },
      guestName: {
        universalIdentifier: 'c2d3e4f5-0617-4283-94a5-1a2b3c4d5e6f',
      },
      guestEmail: {
        universalIdentifier: 'd3e4f506-1728-4394-a5b6-2a3b4c5d6e7f',
      },
      guestNotes: {
        universalIdentifier: 'e4f50617-2839-44a5-b6c7-3a4b5c6d7e8f',
      },
      startsAt: {
        universalIdentifier: 'f5061728-3940-4b5c-87d8-4a5b6c7d8e9f',
      },
      endsAt: {
        universalIdentifier: 'a6172839-4051-4c6d-98e9-5a6b7c8d9e0f',
      },
      status: { universalIdentifier: 'b7283940-5162-4d7e-a9f0-6a7b8c9d0e1f' },
      meetingType: {
        universalIdentifier: 'c8394051-6273-4e8f-b001-7a8b9c0d1e2f',
      },
      person: { universalIdentifier: 'd9405162-7384-4f90-8112-8a9b0c1d2e3f' },
      searchVector: {
        universalIdentifier: 'af049127-f4cf-40a9-9983-b528dd99c003',
      },
    },
    indexes: {
      meetingTypeIdIndex: {
        universalIdentifier: 'e0516273-8495-4001-9223-9a0b1c2d3e4f',
      },
      personIdIndex: {
        universalIdentifier: 'f1627384-9506-4112-a334-0a1b2c3d4e5f',
      },
      statusIndex: {
        universalIdentifier: 'a2738495-0617-4223-b445-1a2b3c4d5e6f',
      },
      searchVectorGinIndex: {
        universalIdentifier: '9c99a465-5956-496b-b690-587c70d2c108',
      },
    },
    views: {
      allBookings: {
        universalIdentifier: 'b3849506-1728-4334-8556-2a3b4c5d6e7f',
        viewFields: {
          guestName: {
            universalIdentifier: 'c4950617-2839-4445-9667-3a4b5c6d7e8f',
          },
          guestEmail: {
            universalIdentifier: 'd5061728-3940-4556-a778-4a5b6c7d8e9f',
          },
          startsAt: {
            universalIdentifier: 'e6172839-4051-4667-b889-5a6b7c8d9e0f',
          },
          status: {
            universalIdentifier: 'f7283940-5162-4778-8990-6a7b8c9d0e1f',
          },
          meetingType: {
            universalIdentifier: 'a8394051-6273-4889-90a1-7a8b9c0d1e2f',
          },
        },
      },
    },
  },
  chatWidget: {
    universalIdentifier: 'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
    fields: {
      id: { universalIdentifier: 'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a' },
      createdAt: {
        universalIdentifier: 'e3f4a5b6-c7d8-4e9f-8a1b-2c3d4e5f6a7b',
      },
      updatedAt: {
        universalIdentifier: 'f4a5b6c7-d8e9-4f0a-9b2c-3d4e5f6a7b8c',
      },
      deletedAt: {
        universalIdentifier: 'a5b6c7d8-e9f0-4a1b-ac3d-4e5f6a7b8c9d',
      },
      position: {
        universalIdentifier: 'b6c7d8e9-f0a1-4b2c-bd4e-5f6a7b8c9d0e',
      },
      createdBy: {
        universalIdentifier: 'c7d8e9f0-a1b2-4c3d-8e5f-6a7b8c9d0e1f',
      },
      updatedBy: {
        universalIdentifier: 'd8e9f0a1-b2c3-4d4e-9f6a-7b8c9d0e1f2a',
      },
      name: { universalIdentifier: 'e9f0a1b2-c3d4-4e5f-aa7b-8c9d0e1f2a3b' },
      status: { universalIdentifier: 'f0a1b2c3-d4e5-4f6a-bb8c-9d0e1f2a3b4c' },
      greetingMessage: {
        universalIdentifier: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5e',
      },
      offlineMessage: {
        universalIdentifier: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6f',
      },
      accentColor: {
        universalIdentifier: 'c3d4e5f6-a7b8-4c9d-8e1f-2a3b4c5d6e70',
      },
      widgetPosition: {
        universalIdentifier: 'd4e5f6a7-b8c9-4d0e-9f2a-3b4c5d6e7f81',
      },
      businessHoursConfig: {
        universalIdentifier: 'e5f6a7b8-c9d0-4e1f-aa3b-4c5d6e7f8092',
      },
      autoResponseEnabled: {
        universalIdentifier: 'f6a7b8c9-d0e1-4f2a-bb4c-5d6e7f8090a3',
      },
      autoResponseDelay: {
        universalIdentifier: 'a7b8c9d0-e1f2-4a3b-8c5d-6e7f8090a1b4',
      },
      autoResponseMessage: {
        universalIdentifier: 'b8c9d0e1-f2a3-4b4c-9d6e-7f8090a1b2c5',
      },
      conversations: {
        universalIdentifier: 'c9d0e1f2-a3b4-4c5d-ae7f-8090a1b2c3d6',
      },
      searchVector: {
        universalIdentifier: 'd0e1f2a3-b4c5-4d6e-bf80-90a1b2c3d4e7',
      },
      noteTargets: {
        universalIdentifier: '6649f5d5-53f8-4822-adf5-117e7328cbec',
      },
      taskTargets: {
        universalIdentifier: 'c969f321-f094-4246-a847-89fda62e2ffe',
      },
      attachments: {
        universalIdentifier: 'c0721efc-642e-44cd-81df-c3e7f0ad999e',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: 'e1f2a3b4-c5d6-4e7f-8091-a2b3c4d5e6f8',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'f2a3b4c5-d6e7-4f80-91a2-b3c4d5e6f7a9',
      },
    },
    views: {
      allChatWidgets: {
        universalIdentifier: 'a3b4c5d6-e7f8-4091-a2b3-c4d5e6f7a8ba',
        viewFields: {
          name: {
            universalIdentifier: 'b4c5d6e7-f809-41a2-b3c4-d5e6f7a8b9cb',
          },
          status: {
            universalIdentifier: 'c5d6e7f8-0910-42b3-84d5-e6f7a8b9c0dc',
          },
          greetingMessage: {
            universalIdentifier: 'd6e7f809-1021-43c4-95e6-f7a8b9c0d1ed',
          },
          autoResponseEnabled: {
            universalIdentifier: 'e7f80910-2132-44d5-a6f7-a8b9c0d1e2fe',
          },
          createdAt: {
            universalIdentifier: 'f8091021-3243-45e6-b7a8-b9c0d1e2f30f',
          },
        },
      },
    },
  },
  chatConversation: {
    universalIdentifier: 'a1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
    fields: {
      id: { universalIdentifier: 'b2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f' },
      createdAt: {
        universalIdentifier: 'c3e4f5a6-b7c8-4d9e-8f1a-2b3c4d5e6f7a',
      },
      updatedAt: {
        universalIdentifier: 'd4f5a6b7-c8d9-4e0f-9a2b-3c4d5e6f7a8b',
      },
      deletedAt: {
        universalIdentifier: 'e5a6b7c8-d9e0-4f1a-ab3c-4d5e6f7a8b9c',
      },
      position: {
        universalIdentifier: 'f6b7c8d9-e0f1-4a2b-bc4d-5e6f7a8b9c0d',
      },
      createdBy: {
        universalIdentifier: 'a7c8d9e0-f1a2-4b3c-8d5e-6f7a8b9c0d1e',
      },
      updatedBy: {
        universalIdentifier: 'b8d9e0f1-a2b3-4c4d-9e6f-7a8b9c0d1e2f',
      },
      visitorName: {
        universalIdentifier: 'c9e0f1a2-b3c4-4d5e-af7a-8b9c0d1e2f3a',
      },
      visitorEmail: {
        universalIdentifier: 'd0f1a2b3-c4d5-4e6f-ba8b-9c0d1e2f3a4b',
      },
      visitorSessionId: {
        universalIdentifier: 'e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
      },
      status: { universalIdentifier: 'f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d' },
      messageCount: {
        universalIdentifier: 'a3c4d5e6-f7a8-4b9c-8d1e-2f3a4b5c6d7e',
      },
      lastMessageAt: {
        universalIdentifier: 'b4d5e6f7-a8b9-4c0d-9e2f-3a4b5c6d7e8f',
      },
      chatWidget: {
        universalIdentifier: 'c5e6f7a8-b9c0-4d1e-af3a-4b5c6d7e8f90',
      },
      person: { universalIdentifier: 'd6f7a8b9-c0d1-4e2f-ba4b-5c6d7e8f90a1' },
      messages: {
        universalIdentifier: 'e7a8b9c0-d1e2-4f3a-8b5c-6d7e8f90a1b2',
      },
      searchVector: {
        universalIdentifier: '3bf4c63d-ed77-472d-b93d-0c652024b77e',
      },
    },
    indexes: {
      chatWidgetIdIndex: {
        universalIdentifier: 'f8b9c0d1-e2f3-4a4b-9c6d-7e8f90a1b2c3',
      },
      personIdIndex: {
        universalIdentifier: 'a9c0d1e2-f3a4-4b5c-ad7e-8f90a1b2c3d4',
      },
      statusIndex: {
        universalIdentifier: 'b0d1e2f3-a4b5-4c6d-be8f-90a1b2c3d4e5',
      },
      searchVectorGinIndex: {
        universalIdentifier: '03ae4da4-930f-4340-bf9c-33f8c6da07c6',
      },
    },
    views: {
      allChatConversations: {
        universalIdentifier: 'c1e2f3a4-b5c6-4d7e-8f90-a1b2c3d4e5f6',
        viewFields: {
          visitorName: {
            universalIdentifier: 'd2f3a4b5-c6d7-4e8f-90a1-b2c3d4e5f6a7',
          },
          visitorEmail: {
            universalIdentifier: 'e3a4b5c6-d7e8-4f90-a1b2-c3d4e5f6a7b8',
          },
          status: {
            universalIdentifier: 'f4b5c6d7-e8f9-4a01-b2c3-d4e5f6a7b8c9',
          },
          messageCount: {
            universalIdentifier: 'a5c6d7e8-f9a0-4b12-83d4-e5f6a7b8c9d0',
          },
          lastMessageAt: {
            universalIdentifier: 'b6d7e8f9-a0b1-4c23-94e5-f6a7b8c9d0e1',
          },
        },
      },
    },
  },
  chatMessage: {
    universalIdentifier: 'b1c2d3e4-f5a6-4778-8d9e-0f1a2b3c4d5f',
    fields: {
      id: { universalIdentifier: 'c2d3e4f5-a6b7-4889-9e0f-1a2b3c4d5e60' },
      createdAt: {
        universalIdentifier: 'd3e4f5a6-b7c8-4990-8f1a-2b3c4d5e6f71',
      },
      updatedAt: {
        universalIdentifier: 'e4f5a6b7-c8d9-40a1-9a2b-3c4d5e6f7a82',
      },
      deletedAt: {
        universalIdentifier: 'f5a6b7c8-d9e0-41b2-ab3c-4d5e6f7a8b93',
      },
      position: {
        universalIdentifier: 'a6b7c8d9-e0f1-42c3-bc4d-5e6f7a8b9c04',
      },
      createdBy: {
        universalIdentifier: 'b7c8d9e0-f1a2-43d4-8d5e-6f7a8b9c0d15',
      },
      updatedBy: {
        universalIdentifier: 'c8d9e0f1-a2b3-44e5-9e6f-7a8b9c0d1e26',
      },
      body: { universalIdentifier: 'd9e0f1a2-b3c4-45f6-af7a-8b9c0d1e2f37' },
      senderType: {
        universalIdentifier: 'e0f1a2b3-c4d5-4607-ba8b-9c0d1e2f3a48',
      },
      senderName: {
        universalIdentifier: 'f1a2b3c4-d5e6-4718-8b9c-0d1e2f3a4b59',
      },
      chatConversation: {
        universalIdentifier: 'a2b3c4d5-e6f7-4829-9c0d-1e2f3a4b5c6a',
      },
      searchVector: {
        universalIdentifier: '9ae61735-9594-4ac5-9d3c-4411578293ed',
      },
    },
    indexes: {
      chatConversationIdIndex: {
        universalIdentifier: 'b3c4d5e6-f7a8-4930-8d1e-2f3a4b5c6d7b',
      },
      searchVectorGinIndex: {
        universalIdentifier: '2b9fa865-e74e-4872-88ac-52fdc6042e89',
      },
    },
    views: {
      allChatMessages: {
        universalIdentifier: 'c4d5e6f7-a8b9-4041-9e2f-3a4b5c6d7e8c',
        viewFields: {
          senderName: {
            universalIdentifier: 'd5e6f7a8-b9c0-4152-af3a-4b5c6d7e8f9d',
          },
          senderType: {
            universalIdentifier: 'e6f7a8b9-c0d1-4263-ba4b-5c6d7e8f90ae',
          },
          body: {
            universalIdentifier: 'f7a8b9c0-d1e2-4374-8b5c-6d7e8f90a1bf',
          },
          createdAt: {
            universalIdentifier: 'a8b9c0d1-e2f3-4485-9c6d-7e8f90a1b2c0',
          },
        },
      },
    },
  },
  sequence: {
    universalIdentifier: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c6d',
    fields: {
      id: { universalIdentifier: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d7e' },
      createdAt: {
        universalIdentifier: '3c4d5e6f-7a8b-4c9d-8e1f-2a3b4c5d6e8f',
      },
      updatedAt: {
        universalIdentifier: '4d5e6f7a-8b9c-4d0e-9f2a-3b4c5d6e7f90',
      },
      deletedAt: {
        universalIdentifier: '5e6f7a8b-9c0d-4e1f-aa3b-4c5d6e7f8001',
      },
      position: {
        universalIdentifier: '6f7a8b9c-0d1e-4f2a-bb4c-5d6e7f800112',
      },
      createdBy: {
        universalIdentifier: '7a8b9c0d-1e2f-4a3b-8c5d-6e7f80011223',
      },
      updatedBy: {
        universalIdentifier: '8b9c0d1e-2f3a-4b4c-9d6e-7f8001122334',
      },
      name: { universalIdentifier: '9c0d1e2f-3a4b-4c5d-ae7f-800112233445' },
      description: {
        universalIdentifier: '0d1e2f3a-4b5c-4d6e-bf80-011223344556',
      },
      status: {
        universalIdentifier: '1e2f3a4b-5c6d-4e7f-8001-122334455667',
      },
      stepCount: {
        universalIdentifier: '2f3a4b5c-6d7e-4f80-8112-233445566778',
      },
      enrollmentCount: {
        universalIdentifier: '3a4b5c6d-7e8f-4001-9223-344556677889',
      },
      activeEnrollmentCount: {
        universalIdentifier: '4b5c6d7e-8f90-4112-a334-45566778899a',
      },
      completedCount: {
        universalIdentifier: '5c6d7e8f-9001-4223-b445-566778899a0b',
      },
      replyRate: {
        universalIdentifier: '6d7e8f90-0112-4334-8556-6778899a0b1c',
      },
      autoEnrollEnabled: {
        universalIdentifier: '7e8f9001-1223-4445-9667-78899a0b1c2d',
      },
      pauseOnReply: {
        universalIdentifier: '8f900112-2334-4556-a778-899a0b1c2d3e',
      },
      steps: {
        universalIdentifier: '90011223-3445-4667-b889-9a0b1c2d3e4f',
      },
      enrollments: {
        universalIdentifier: '01122334-4556-4778-8990-a0b1c2d3e4f5',
      },
      searchVector: {
        universalIdentifier: '12233445-5667-4889-9a0b-1c2d3e4f5a60',
      },
      noteTargets: {
        universalIdentifier: 'e2b0957e-371d-4e2a-93c0-df16b694455a',
      },
      taskTargets: {
        universalIdentifier: '1a06d56e-ff64-4ac7-86f0-6a7ebb2d9d6c',
      },
      attachments: {
        universalIdentifier: 'c6657c7c-2757-4b97-a5ed-5cf7954f7430',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '23344556-6778-4990-8b1c-2d3e4f5a6b71',
      },
      searchVectorGinIndex: {
        universalIdentifier: '34455667-7889-40a1-9c2d-3e4f5a6b7c82',
      },
    },
    views: {
      allSequences: {
        universalIdentifier: '45566778-8990-41b2-ad3e-4f5a6b7c8d93',
        viewFields: {
          name: {
            universalIdentifier: '56677889-90a1-42c3-be4f-5a6b7c8d9ea4',
          },
          status: {
            universalIdentifier: '67788990-a1b2-43d4-8f5a-6b7c8d9e0fb5',
          },
          stepCount: {
            universalIdentifier: '78899a01-b2c3-44e5-9a6b-7c8d9e0f10c6',
          },
          enrollmentCount: {
            universalIdentifier: '899a0b12-c3d4-45f6-ab7c-8d9e0f1021d7',
          },
          replyRate: {
            universalIdentifier: '9a0b1c23-d4e5-4607-bc8d-9e0f102132e8',
          },
          createdAt: {
            universalIdentifier: '0b1c2d34-e5f6-4718-8d9e-0f10213243f9',
          },
        },
      },
    },
  },
  sequenceStep: {
    universalIdentifier: 'a1b2c3d4-e5f6-4a78-9c0d-1e2f3a4b5c7d',
    fields: {
      id: { universalIdentifier: 'b2c3d4e5-f6a7-4b89-8d1e-2f3a4b5c6d8e' },
      createdAt: {
        universalIdentifier: 'c3d4e5f6-a7b8-4c90-9e2f-3a4b5c6d7e9f',
      },
      updatedAt: {
        universalIdentifier: 'd4e5f6a7-b8c9-4d01-af3a-4b5c6d7e8f00',
      },
      deletedAt: {
        universalIdentifier: 'e5f6a7b8-c9d0-4e12-ba4b-5c6d7e8f9011',
      },
      position: {
        universalIdentifier: 'f6a7b8c9-d0e1-4f23-8b5c-6d7e8f901122',
      },
      createdBy: {
        universalIdentifier: 'a7b8c9d0-e1f2-4034-9c6d-7e8f90112233',
      },
      updatedBy: {
        universalIdentifier: 'b8c9d0e1-f2a3-4145-ad7e-8f9011223344',
      },
      stepOrder: {
        universalIdentifier: 'c9d0e1f2-a3b4-4256-be8f-901122334455',
      },
      type: {
        universalIdentifier: 'd0e1f2a3-b4c5-4367-8f90-112233445566',
      },
      delayDays: {
        universalIdentifier: 'e1f2a3b4-c5d6-4478-9001-223344556677',
      },
      subject: {
        universalIdentifier: 'f2a3b4c5-d6e7-4589-8112-334455667788',
      },
      bodyHtml: {
        universalIdentifier: 'a3b4c5d6-e7f8-4690-9223-445566778899',
      },
      sequence: {
        universalIdentifier: 'b4c5d6e7-f8a9-4701-a334-5566778899a0',
      },
      searchVector: {
        universalIdentifier: '87927e6f-3d0d-4e38-b65e-0c08eec3dfc4',
      },
    },
    indexes: {
      sequenceIdIndex: {
        universalIdentifier: 'c5d6e7f8-a9b0-4812-b445-66778899a0b1',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'd090842d-56fd-44da-89dc-081c9167a454',
      },
    },
    views: {
      allSequenceSteps: {
        universalIdentifier: 'd6e7f8a9-b0c1-4923-8556-778899a0b1c2',
        viewFields: {
          stepOrder: {
            universalIdentifier: 'e7f8a9b0-c1d2-4034-9667-8899a0b1c2d3',
          },
          type: {
            universalIdentifier: 'f8a9b0c1-d2e3-4145-a778-99a0b1c2d3e4',
          },
          delayDays: {
            universalIdentifier: 'a9b0c1d2-e3f4-4256-b889-a0b1c2d3e4f5',
          },
          subject: {
            universalIdentifier: 'b0c1d2e3-f4a5-4367-8990-b1c2d3e4f5a6',
          },
          createdAt: {
            universalIdentifier: 'c1d2e3f4-a5b6-4478-90a1-c2d3e4f5a6b7',
          },
        },
      },
    },
  },
  sequenceEnrollment: {
    universalIdentifier: 'd1e2f3a4-b5c6-4789-8d1e-2f3a4b5c6d8e',
    fields: {
      id: { universalIdentifier: 'e2f3a4b5-c6d7-4890-9e2f-3a4b5c6d7e9f' },
      createdAt: {
        universalIdentifier: 'f3a4b5c6-d7e8-4901-af3a-4b5c6d7e8f00',
      },
      updatedAt: {
        universalIdentifier: 'a4b5c6d7-e8f9-4012-ba4b-5c6d7e8f9011',
      },
      deletedAt: {
        universalIdentifier: 'b5c6d7e8-f9a0-4123-8b5c-6d7e8f901122',
      },
      position: {
        universalIdentifier: 'c6d7e8f9-a0b1-4234-9c6d-7e8f90112233',
      },
      createdBy: {
        universalIdentifier: 'd7e8f9a0-b1c2-4345-ad7e-8f9011223344',
      },
      updatedBy: {
        universalIdentifier: 'e8f9a0b1-c2d3-4456-be8f-901122334455',
      },
      status: {
        universalIdentifier: 'f9a0b1c2-d3e4-4567-8f90-112233445566',
      },
      currentStepIndex: {
        universalIdentifier: 'a0b1c2d3-e4f5-4678-9001-223344556677',
      },
      enrolledAt: {
        universalIdentifier: 'b1c2d3e4-f5a6-4789-8112-334455667788',
      },
      completedAt: {
        universalIdentifier: 'c2d3e4f5-a6b7-4890-9223-445566778899',
      },
      lastStepAt: {
        universalIdentifier: 'd3e4f5a6-b7c8-4901-a334-5566778899a0',
      },
      sequence: {
        universalIdentifier: 'e4f5a6b7-c8d9-4012-b445-66778899a0b1',
      },
      person: {
        universalIdentifier: 'f5a6b7c8-d9e0-4123-8556-778899a0b1c2',
      },
      searchVector: {
        universalIdentifier: '81a6d310-efaa-4268-9d85-ea06cff746a5',
      },
    },
    indexes: {
      sequenceIdIndex: {
        universalIdentifier: 'a6b7c8d9-e0f1-4234-9667-8899a0b1c2d3',
      },
      personIdIndex: {
        universalIdentifier: 'b7c8d9e0-f1a2-4345-a778-99a0b1c2d3e4',
      },
      statusIndex: {
        universalIdentifier: 'c8d9e0f1-a2b3-4456-b889-a0b1c2d3e4f5',
      },
      searchVectorGinIndex: {
        universalIdentifier: '3ee1b11b-224d-4fb6-92b4-44eaeb2225b3',
      },
    },
    views: {
      allSequenceEnrollments: {
        universalIdentifier: 'd9e0f1a2-b3c4-4567-8990-b1c2d3e4f5a6',
        viewFields: {
          status: {
            universalIdentifier: 'e0f1a2b3-c4d5-4678-90a1-c2d3e4f5a6b7',
          },
          currentStepIndex: {
            universalIdentifier: 'f1a2b3c4-d5e6-4789-a1b2-d3e4f5a6b7c8',
          },
          enrolledAt: {
            universalIdentifier: 'a2b3c4d5-e6f7-4890-b2c3-e4f5a6b7c8d9',
          },
          completedAt: {
            universalIdentifier: 'b3c4d5e6-f7a8-4901-83d4-f5a6b7c8d9e0',
          },
          sequence: {
            universalIdentifier: 'c4d5e6f7-a8b9-4012-94e5-a6b7c8d9e0f1',
          },
        },
      },
    },
  },
} as const satisfies Record<
  string,
  {
    universalIdentifier: string;
    morphIds?: Record<string, { morphId: string }>;
    fields: Record<string, { universalIdentifier: string }>;
    indexes: Record<string, { universalIdentifier: string }>;
    views?: Record<
      string,
      {
        universalIdentifier: string;
        viewFields: Record<string, { universalIdentifier: string }>;
        viewFieldGroups?: Record<string, { universalIdentifier: string }>;
        viewFilters?: Record<string, { universalIdentifier: string }>;
        viewGroups?: Record<string, { universalIdentifier: string }>;
      }
    >;
  }
>;
