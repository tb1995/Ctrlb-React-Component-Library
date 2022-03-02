		const imgDirectory = "/img/component-images/"

		export let masterComponentArray = [
		{
		label: "Heroes",
		list: [
				{
					title: "Hero Fullscreen",
					description: "Hero with 100vh and with a CTA",
					url: "/Heroes/Fullscreen",
					imgUrl: imgDirectory + "hero-fullscreen.png",
					dependencies: [],
					listOfProps: []
                },
                {
					title: "Hero Halfscreen",
					description: "Hero with 50vh and with a CTA",
					url: "/Heroes/Halfscreen",
					imgUrl: imgDirectory + "hero-halfscreen.png",
					dependencies: [],
					listOfProps: []
				}
			],
		},
		{
		label: "Grids",
		list: [
			{
				title: "Responsive Grid",
				description: "Specify the number of columns and item width via the props",
				url: "/Grids/Responsive",
				imgUrl: imgDirectory + "responsive-grid.png",
				dependencies: [],
				listOfProps: []
			},
			{
				title: "Responsive Grid More Info",
				description: "Specify the number of columns and item width via the props",
				url: "/Grids/Responsive-Info",
				imgUrl: imgDirectory + "responsive-grid.png",
				dependencies: [],
				listOfProps: []
			},
			{
				title: "Responsive Grid Icons",
				description: "Specify the number of columns and item width via the props, uses fixed icon size",
				url: "/Grids/Responsive-Info-Icons",
				imgUrl: imgDirectory + "responsive-grid.png",
				dependencies: [],
				listOfProps: []
			}
		],
        },
        {
            label: "Info Sections",
            list: [
                {
                    title: "Info section 1",
                    description: "image on the left, text block and btn on the right",
                    url: "/Info/1",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				 {
                    title: "Info section 1 Alternate",
                    description: "Has tiny text and different styled button",
                    url: "/Info/1-Alt",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				 {
                    title: "Info section 1 Laterally Reversed",
                    description: "Has tiny text and different styled button, but the orders are switched around",
                    url: "/Info/1-Reversed",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				 {
                    title: "Info section 2x2 Grids",
                    description: "Has tiny text and different styled button, with 2x2 Grid",
                    url: "/Info/Grids",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
            label: "Tabs",
            list: [
                {
                    title: "Centered Tabs",
                    description: "Tabs",
                    url: "/Tabs/Centered",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Navbars",
		list: [
                {
                    title: "Top Traditional",
                    description: "Top traditional",
                    url: "/Navbar/Traditional",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Footers",
		list: [
                {
                    title: "Four Column Footer",
                    description: "Four Column Footer",
                    url: "/Footers/Column-4",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Banners",
		list: [
                {
                    title: "Only Button",
                    description: "Contains only a singular button",
                    url: "/Banners/OnlyButton",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "Paragraph and Button",
                    description: "Contains a paragraph and a button",
                    url: "/Banners/Paragraph-Button",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
        }

	]
	
	export let navbarArray = [
		{
			label: "About",
			url: ""
		},
		{
			label: "Locations",
			url: ""
		},
		{
			label: "Private Dining",
			url: ""
		},
		{
			label: "Galleries",
			url: ""
		},
		{
			label: "Menus",
			url: ""
		},
		{
			label: "Contact",
			url: ""
		},
	]

	export let iconList = [
		{
			label: "090078601",
			iconUrl: "/img/logo.png",
			iconAlt: ""

		},
		{
			label: "holmes@consultingdetective.com",
			iconUrl: "/img/logo.png",
			iconAlt: ""
		},
		{
			label: "22B Baker Street, ",
			iconUrl: "/img/logo.png",
			iconAlt: ""
		},
	]


	export let responsiveListMoreInfoList =  [
				{
					title: "Hero Fullscreen",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: imgDirectory + "hero-fullscreen.png",
					buttonText: "Go to Hero Fullscreen",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                },
                {
					title: "Hero Fullscreen 2",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: imgDirectory + "hero-fullscreen.png",
					buttonText: "Go to Hero Fullscreen 2",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
				},
				
			]

	export let responsiveListIconList =  [
				{
					title: "Hero Fullscreen",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: "/img/logo.png",
					buttonText: "Go to Hero Fullscreen",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                },
                {
					title: "Hero Fullscreen 2",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: "/img/logo.png",
					buttonText: "Go to Hero Fullscreen 2",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
				},
				{
					title: "Hero Fullscreen 3",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: "/img/logo.png",
					buttonText: "Go to Hero Fullscreen 3",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
				},
				
			]

	export let fourGrids = [
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
	]