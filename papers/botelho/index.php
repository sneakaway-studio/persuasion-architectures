<?php

$author = "botelho";
include_once('../../inc/paper-heading.php');
// print_r($paper);

?>


<div class="container">
	<div class="row my-2">
		<div class="col-12 col-lg-8 offset-lg-2">


			<?php include_once('../../inc/paper-thumbnail.php'); ?>




			<h5 class="subheading">Introduction</h5>

			<p>
				Companies are constantly vying for consumer attention, optimizing how much time
				consumers spend on their platform, thus increasing advertising revenue. Technologists can make
				hundreds of thousands of dollars per year to design these addictive systems. YouTube was one of
				the first companies to implement this technology in 2005. The company has since grown and
				boasts over two billion users (Singh, 2022). Pew Research Center found that 94% of Americans
				between 18 and 24 use YouTube (Ibid). One of the main draws of YouTube is that people spend
				more time than initially desired. Recommended videos and autoplay encourage this behavior.
				Advertisers cash in on the captured attention of the audience, playing ads before, during, or even
				within videos.
			</p>


			<p>
				YouTube captures, coerces, and commodifies the attention of its users by learning what
				they like and influencing user preferences. To understand how YouTube captivates its audience,
				one must understand how recommender systems work. I will introduce the main types of
				recommender systems: Content-based, Collaborative-filtering, and Knowledge-based (Ibid).
				Then, I analyze the strategies and design decisions of YouTube and assess its effectiveness.
				After, I will dissect how these tactics are manipulative by encouraging people to spend more
				time on the platform. I then examine how recommender systems circulate harmful content like
				pedophilia and far-right radicalization, encouraging people to tend toward radicalized extremes.
				Finally, I propose various solutions for platform improvement to resist these persuasion tactics.
			</p>




			<h5 class="subheading">Recommender Systems</h5>

			<p>
				The first recommender system, Grundy, was created in 1979. Its purpose was to suggest
				library books to readers. By the early 1990s, companies released commercial recommender systems, and in the late 1990s, Amazon invented the collaborative filtering technique, which has
				since become widely popular. More recently, in 2006, Netflix hosted a contest with a
				million-dollar prize for whoever could implement the best recommendation system, and finally,
				in 2010, YouTube implemented a recommendation system (Qomariyah, 2020).
			</p>

			<p>
				Recommender systems can track user activity history or create a profile of similar users to
				predict the type of content a user may want to see in the future. Content-based systems use
				metadata on a user, such as clicks and likes to hone in on what they want to view.
				Collaborative-filtering systems base suggestions on the interests of similar users. These systems
				base recommendations on which content tends to be purchased or viewed in conjunction. Since
				these systems look at other users, they make predictions based on a substantially larger dataset.
				Knowledge-based recommender systems look at the attributes of both the user and the product.
				"For example, such a system could identify attribute similarities between a job seeker’s resume
				and a job description" (Singh, 2022). Singh points out that most algorithms employ all the above
				systems, not just one.
			</p>








			<h5 class="subheading">Persuasion Tactics</h5>

			<p>
				YouTube’s ingenious algorithm represents a fundamental shift of the embrace of
				classical machine learning methods like tree and linear-based methods to deep learning,
				which can hold the complexity, yet adaptability and robustness required for modern-day
				problems. Yet deep learning models need to be carefully used — not as a bashable
				cookie-cutter solution to everything but as a delicate tool — which is purposed cleverly
				by YouTube to their unique problems (Ibid).
			</p>

			<p>
				YouTube's tactics have led to $7 billion in ad revenue in 2021 alone. The pandemic has
				expedited the growth of online shopping, making online advertisements a gold mine. YouTube
				employs several design strategies to induce users into spending more time. Measures include
				notifications to grab user attention or autoplay; a recommended video will play automatically
				without a user having to do anything. Creators have tools to boost engagement, such as user data
				on the exact moment a watcher clicked out of a video. YouTube creators also know that
				subscriptions drive engagement. The company benefits tremendously from in-video advertising.
				“A marketing study by ThinkByGoogle found that brand collaborations with YouTube creators
				are ‘4x more effective at driving lift in brand familiarity than those with celebrities” (Wong,
				2021).
			</p>





		</div>
	</div>
</div>


<div class="container-fluid px-0 my-2 mb-4">
	<div class="container px-0">
		<div class="row">
			<div class="col-12">

				<iframe id="iframe1" width="100%" height="860px" frameBorder="0" src="game/RadRecommenders.html" scrolling="no"></iframe>

				<figcaption class="figure-caption">


					<details>
						<summary>Rad Recommenders by Blake Botelho</summary>

						<p>
							For as long as I have had access to a smartphone, I have been an avid user of YouTube. I am mesmerized by the algorithm's ability to recommend enjoyable videos. In my Digital Studies minor, I have wrestled with the many drawbacks that modern-day technology and software can have on society and the benefits. I am particularly passionate about understanding the effects of recommender systems, namely YouTube.
						</p>

						<p>
							After deciding that I wanted to work on a game that captures the experience someone may have using a recommender system, classmate Evan Rothman suggested I create a game where users click on which videos to watch. The game, now titled Rad Recommenders, has since blossomed into its final version, where users can simulate the experience watching YouTube of one of two playable characters: Billy or Danny. Once a person chooses their character, I provide narrative background on each. I then pick an initial YouTube page based on the pre-assigned demographic information and interests. The rest of the game is a mix of YouTube pages and narration. The player can choose from which videos they want more recommended content. This game enables players to take many different paths. It can be played at a slow pace, watching each of the videos on each page, or relatively quickly.
						</p>

						<p>
							Rad Recommenders tackles pressing topics, notably Xenophobia and Sexism. Depending on the path they take, users can encounter upsetting videos. I hope that people realize the unintentional effects recommender systems can have when not carefully designed to account for them. I did not create this game to demonize YouTube but to offer criticism to better the platform. From the player's perspective, I hope that people are more mindful of the effects recommender systems can have on them. I offer solutions on how legislators can improve recommender systems. I encourage people to wrestle with these proposed solutions, expanding upon and improving them.
						</p>

					</details>
				</figcaption>

			</div>
		</div>
	</div>


	<div class="container">
		<div class="row my-2">
			<div class="col-12 col-lg-8 offset-lg-2">






				<p>
					According to the Chief Product Officer, people spend 70% of their time watching
					recommended videos on YouTube. The company must overcome the following difficulties: Scale
					(recommendation systems can be harder to implement on YouTube given the sheer volume of
					videos), videos are constantly being uploaded, so there needs to be a way to balance new content and old content, and user behavior can be complicated. To overcome this, YouTube starts by
					creating a list of a few hundred videos the user may enjoy and then using a second neural
					network to display the top three videos as recommendations. They show users videos the
					company has assessed that the user is most likely to watch for the most time. The algorithm is
					more likely to spread controversial content that sparks a strong reaction and keeps users engaged.
					Human monitors remove videos that violate community standards, but the mental toll this takes
					on the checkers can often be severe (Ye, 2020).
				</p>




				<h5 class="subheading">How YouTube Manipulates Users</h5>


				<p>
					Nick Seaver compares recommender algorithms to animal traps. Companies capture user
					retention the same way a hunter traps an animal (Seaver, 2019). Seaver’s analogy serves as a
					framework for viewing the manipulative aspect of recommender systems. The user molds the
					algorithm, and the algorithm molds the user. The algorithm can be self-fulfilling since
					recommended videos can have a placebo effect. Adomavicius et al. conducted an experiment
					where consumers listened to and rated songs between 1 and 5 stars. Experimenters randomly
					assigned recommendations, yet consumers were willing to pay between 12% and 17% more for a
					one-star increase in a song rating. Researchers persuaded consumers to spend more simply
					because the machine indicates they would like something, even if the recommendation is based
					on nothing (Adomavicius, et al 2019).
				</p>




				<h5 class="subheading">Radicalization</h5>


				<p>
					Beyond the time manipulation on YouTube lies an even more serious problem:
					radicalization. Sinead Bovell from Wired experimented to see how YouTube polarizes its
					audience. Bovell created three accounts. She watched and liked a left-leaning video from
					MSNBC, a center-leaning video from ABC on another account, and a right-leaning Fox News video on a third account. After liking each video, her recommended videos were drastically
					different between each. The MSNBC account recommended liberal content, the ABC account
					moderate content, and the Fox News account conservative content. (WIRED, 2020).
				</p>

				<p>
					Dr. Tim Kessler conducted a similar experiment. He posed as his Dad by creating profiles
					on different platforms. After entering that he liked to eat meat and pasta on a recipe website, the
					recommender continued to suggest meat and pasta recipes. To prove how these recommender
					systems can negatively impact physical health in addition to mental health, Dr. Kessler ate what
					he was recommended for a month. This experiment resulted in him gaining weight and becoming
					ill. On Facebook, after entering his elderly Dad’s demographic information and interests (history,
					golf, documentaries, etc.), Facebook recommended over 50 neo-Nazi groups in a month (TEDx
					Talks, 2019).
				</p>

				<p>
					This startling revelation extends to YouTube as well. Caolan Robertson is a prime
					example. Robertson is a gay man from Ireland who has faced prolonged hostility due to his
					sexuality. When Robertson moved to London, he experienced the most homophobia when
					walking in predominately Muslim neighborhoods. Robertson began watching YouTube videos
					about the Orlando nightclub shooting at a gay club in 2016. He became exposed to far-right
					perspectives on the tragic event. After watching these videos, Robertson became staunchly
					Islamophobic and anti-immigrant. YouTube's curated chorus of hateful voices affirmed his
					right-winged views. His perspective changed after the mosque shooting in New Zealand. He saw
					how online radicalization could affect different groups, not just his own, and he has since worked
					to de-radicalize others. His story shows the dangers of unchecked algorithms (Metz, 2021).
				</p>

				<p>
					YouTube’s recommender system has also enabled pedophiles to use the platform to view
					videos of young children. Christianne posted a YouTube video of her young daughter and a friend playing in a pool. Within days, the view count skyrocketed to 400,000. Users were
					purposefully seeking out content that showed young children, and YouTube connected them with
					these and other similar videos. This video spread months after people criticized YouTube for this
					exact issue. A group of researchers found that on sexually themed videos, as videos became
					more abnormal, they placed a greater emphasis on youth. For example, videos of women
					discussing sex eventually led to videos of teenage moms breastfeeding. (Fisher and Taub, 2019).
					Innocent videos of children were being recommended to pedophiles, and some of these videos
					had view counts in the millions (Ibid). YouTube’s algorithm suffers from and has suffered from
					issues that enable egregious behaviors and viewpoints to flourish. Lawmakers, and others alike,
					have proposed legislation and solutions to combat these issues.
				</p>


				<h5 class="subheading">Solutions</h5>

				<p>
					People have proposed solutions to mitigate the dangers of profit-maximizing
					recommender systems. Stray et al. suggest that imitation learning can be a more predictable
					method. They also recommend a feature that shows a receipt of where a person has clicked or
					shows they have watched. By having a clearer understanding of how an algorithm sways
					decision-making, people can avoid feeling manipulated. Through the ability to review their
					course of action, a person has more autonomy to avoid previous traps that lead them down
					content viewing paths. Profit-maximizing companies would not likely apply this method without
					being required. Legislative enforcement can ensure they do and with it more algorithmic
					transparency.
				</p>

				<p>
					A new Chinese law has been pioneering stricter regulations on recommender systems.
					This law includes the following: companies must inform users how a recommender system
					works, users need to be able to opt-out, users must have the option to get rid of tags used to make recommendations, and companies must protect the elderly from recommender system scams.
					Laws like these increase the transparency and agency of consumers by allowing users to take
					ownership over what they see. Consumers can still benefit from recommendation systems' ability
					to connect them with relevant content while lessening the potential risks (Kharpal, 2022).
				</p>





				<h5 class="subheading">Conclusion</h5>

				<p>
					This piece has given an overview of how recommendation algorithms work to maintain
					user attention. In commodifying its users, platforms walk a dangerous line. Provocative content
					can be the most reactionary and the most successful at accomplishing the purpose of the
					algorithm. YouTube is known to encourage radicalization. Studies have confirmed how
					recommendation systems coerce people and provide a re-enforcement loop that can lead to bad
					outcomes. People watch more extreme videos over time until they have reached the point of
					radicalization. Without regulation, these systems can and will hurt people in the process.
					Thankfully, there are codifiable suggestions discussed in the Solutions section that safeguard
					against these pitfalls and improve recommender systems.
				</p>






			</div>
		</div>
	</div>







	<div class="container">
		<div class="row my-2">
			<div class="col-12 col-lg-8 offset-lg-2">

				<h4>Bibliography</h4>


				<ol>

					<li>Adomavicius, Gediminas, Jesse Bockstedt, Shawn P. Curley, Jingjing Zhang, and Sam
						Ransbotham. 2019. “The Hidden Side Effects of Recommendation Systems.” MIT
						Sloan Management Review 60 (2): 1.</li>
					<li>Fisher, Max, and Amanda Taub. 2019. “On YouTube’s Digital Playground, an Open Gate
						for Pedophiles.” The New York Times, June 3, 2019, sec. World.
						https://www.nytimes.com/2019/06/03/world/americas/youtube-pedophiles.html.</li>
					<li>Kharpal, Arjun. 2022. “China’s next Regulatory Target — Algorithms, the Secret of
						Many Tech Giants’ Success.” CNBC. January 7, 2022.
						https://www.cnbc.com/2022/01/07/china-to-regulate-tech-giants-algorithms-in-un
						precedented-move.html.</li>
					<li>Metz, Cada “Feeding Hate with Video: A Former Alt-Right YouTuber Explains His
						Methods.” 2021. The Denver Post (blog). May 22, 2021.
						https://www.denverpost.com/2021/05/22/youtube-alt-right-racism-internet/.</li>
					<li>“Our Reality Shaped by Recommendation Algorithms | Dr. Tim Kessler | TEDxTUBerlin
						- YouTube.” n.d. Accessed February 9, 2022.
						https://www.youtube.com/watch?v=bPdRBXpjENI.</li>
					<li>Qomariyah, Nunung Nurul . “Definition and History of Recommender Systems.” n.d.
						Computer Science (blog). Accessed March 1, 2022.
						https://international.binus.ac.id/computer-science/2020/11/03/definition-and-histo
						ry-of-recommender-systems/.</li>
					<li>Seaver, Nick. 2019. “Captivating Algorithms: Recommender Systems as Traps.” Journal
						of Material Culture 24 (4): 421–36. https://doi.org/10.1177/1359183518820366.</li>
					<li>Singh, Spandana. “Why Am I Seeing This?” n.d. New America. Accessed February 16,
						2022. http://newamerica.org/oti/reports/why-am-i-seeing-this/.</li>
					<li>Stray, Jonathan, Ivan Vendrov, Jeremy Nixon, Steven Adler, and Dylan Hadfield-Menell.
						2021. “What Are You Optimizing for? Aligning Recommender Systems with
						Human Values.” ArXiv:2107.10939 [Cs], July. http://arxiv.org/abs/2107.10939.</li>
					<li>WIRED. 2020. Is the YouTube Algorithm Controlling Us?
						https://www.youtube.com/watch?v=XuORTmLhIiU.</li>
					<li>Wong, Michael. “[UX Case Study] How YouTube Keeps You Watching and Addicted.”
						2021. The Designership. September 23, 2021.
						https://thedesignership.com/how-youtube-keeps-you-watching-addicted/.</li>
					<li>Ye, Andre. 2020. “The Algorithm Worth Billions: How YouTube’s Addictive Video
						Recommender Works.” Medium. May 22, 2020.
						https://faun.pub/the-algorithm-worth-billions-how-youtubes-addictive-video-reco
						mmender-works-d75646dac6a3.</li>

				</ol>


			</div>
		</div>
	</div>


	<?php include_once('../../inc/footer.php'); ?>