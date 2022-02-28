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
