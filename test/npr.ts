import { Json, Dict, Key } from '../src/types';

export const BASIC = { a: 1, b: 2, c: null, d: 4 };

export const TEST_DATA = {
  version: '0.6',
  list: {
    title: { $text: 'Stories from NPR' },
    teaser: { $text: 'Assorted stories from NPR' },
    miniTeaser: {
      $text:
        'Custom NPR News Feed API.  Visit http://api.npr.org/help.html for more information.'
    },
    story: [
      {
        id: '91280049',
        type: 'story',
        active: 'true',
        link: [
          {
            type: 'html',
            $text:
              'http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3'
          },
          { type: 'api', $text: 'http://api.npr.org/query?id=91280049' }
        ],
        title: { $text: 'King and Holmes on Boxing' },
        subtitle: {},
        shortTitle: {},
        teaser: {
          $text:
            'Scott Simon talks with boxing promoter Don King and boxing hall of famer Larry Holmes about their new video game, <em>Don King Presents: Prizefighter</em>, with story lines, in and out of the ring.'
        },
        miniTeaser: {
          $text:
            'Don King and Larry Holmes reminisce about their decades of involvement in the sport.'
        },
        slug: { $text: 'Interviews' },
        thumbnail: {},
        storyDate: { $text: 'Sat, 07 Jun 2008 08:00:00 -0400' },
        pubDate: { $text: 'Sat, 07 Jun 2008 11:04:00 -0400' },
        lastModifiedDate: { $text: 'Sat, 07 Jun 2008 11:06:33 -0400' },
        show: [
          {
            program: {
              id: '7',
              code: 'WESAT',
              $text: 'Weekend Edition Saturday'
            },
            showDate: { $text: 'Sat, 07 Jun 2008 08:00:00 -0400' },
            segNum: { $text: '21' }
          }
        ],
        keywords: {},
        priorityKeywords: {},
        organization: [
          {
            orgId: '1',
            orgAbbr: 'NPR',
            name: { $text: 'National Public Radio' },
            website: { type: 'Home Page', $text: 'http://www.npr.org/' }
          }
        ],
        parent: [
          {
            id: '1055',
            type: 'topic',
            title: { $text: 'Sports' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1055&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1055' }
            ]
          },
          {
            id: '1052',
            type: 'topic',
            title: { $text: 'Fun & Games' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1052&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1052' }
            ]
          },
          {
            id: '1051',
            type: 'topic',
            title: { $text: 'Diversions' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1051&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1051' }
            ]
          },
          {
            id: '1049',
            type: 'topic',
            title: { $text: 'Digital Culture' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1049&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1049' }
            ]
          },
          {
            id: '1022',
            type: 'topic',
            title: { $text: 'Interviews' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1022&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1022' }
            ]
          },
          {
            id: '1022',
            type: 'primaryTopic',
            title: { $text: 'Interviews' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1022&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1022' }
            ]
          },
          {
            id: '1021',
            type: 'topic',
            title: { $text: 'People & Places' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/topics/topic.php?topicId=1021&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1021' }
            ]
          }
        ],
        audio: [
          {
            id: '91280057',
            primary: 'true',
            title: {},
            duration: { $text: '425' },
            format: {
              mp3: {
                $text:
                  'http://api.npr.org/m3u/191280057-bd7a36.m3u&f=91280049&ft=3'
              },
              wm: {
                $text:
                  'http://api.npr.org/templates/dmg/dmg_wmref_em.php?id=91280057&type=1&mtype=WM&f=91280049&ft=3'
              },
              rm: {
                $text:
                  'http://api.npr.org/templates/dmg/dmg_rpm.rpm?id=91280057&type=1&mtype=RM&f=91280049&ft=3'
              }
            },
            rightsHolder: {}
          }
        ],
        container: [
          {
            id: '91281093',
            title: { $text: 'Related NPR Stories' },
            introText: {},
            link: { refId: '91281096', num: '1' },
            link: { refId: '91281098', num: '2' },
            link: { refId: '91281100', num: '3' },
            link: { refId: '91281102', num: '4' }
          }
        ],
        relatedLink: [
          {
            id: '91281096',
            type: 'internal',
            caption: { $text: 'Mixed Martial Arts: A Knockout to Boxing?' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/story/story.php?storyId=89662907&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=89662907' }
            ],
            displayDate: { $text: 'true' }
          },
          {
            id: '91281098',
            type: 'internal',
            caption: { $text: 'A Conversation with Don King' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/story/story.php?storyId=5132610&f=91280049&ft=3'
              },
              {
                type_TEST: 'api',
                $text: 'http://api.npr.org/query?id=5132610'
              }
            ],
            displayDate: { $text: 'true' }
          },
          {
            id: '91281100',
            type: 'internal',
            caption: { $text: 'Boxing: From Big-Time to Big Screen' },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/story/story.php?storyId=4696372&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=4696372' }
            ],
            displayDate: { $text: 'true' }
          },
          {
            id: '91281102',
            type: 'internal',
            caption: { $text: "Commentary: When Your Neighbor's a Champ" },
            link: [
              {
                type: 'html',
                $text:
                  'http://api.npr.org/templates/story/story.php?storyId=1595889&f=91280049&ft=3'
              },
              { type: 'api', $text: 'http://api.npr.org/query?id=1595889' }
            ],
            displayDate: { $text: 'true' }
          }
        ],
        fullStory: {
          $text:
            '<div class="slug"><a href="/templates/topics/topic.php?topicId=1022">Interviews</a></div><!-- END CLASS="SLUG" --><h1>King and Holmes on Boxing</h1>                <div class="listenblock">                    <p class="listentab"><a href="javascript:NPR.Player.openPlayer(91280049, 91280057, null, NPR.Player.Action.PLAY_NOW, NPR.Player.Type.STORY, \'0\')" class="listen">Listen Now</a> <span class="duration">[7 min 5 sec]</span> <a href="javascript:NPR.Player.openPlayer(91280049, 91280057, null, NPR.Player.Action.ADD_TO_PLAYLIST, NPR.Player.Type.STORY, \'0\')" class="add">add to playlist</a> </p>                </div><!-- START TOP RESOURCE POSITION --><!-- START INSET COLUMN --><!-- END INSET COLUMN --><!-- START STORY CONTENT --><p><span class="program"><a href="/templates/rundowns/rundown.php?prgId=7">Weekend Edition Saturday</a>,</span> <span class="date">June 7, 2008 · </span> Scott Simon talks with boxing promoter Don King and boxing hall of famer Larry Holmes about their new video game, <em>Don King Presents: Prizefighter</em>, with story lines, in and out of the ring.</p><!-- END STORY CONTENT --><!-- STATIC PLAYLIST --><!-- START RELATED STORIES --><div class="dynamicbucket"><div class="buckettop"> </div><!-- END CLASS="BUCKETTOP" --><h3>Related NPR Stories</h3><div class="bucketcontent"><ul class="iconlinks"><li><div class="date">April 16, 2008</div><a href="/templates/story/story.php?storyId=89662907" class="iconlink related">Mixed Martial Arts: A Knockout to Boxing?</a></li><li><div class="date">Jan. 6, 2006</div><a href="/templates/story/story.php?storyId=5132610" class="iconlink related">A Conversation with Don King</a></li><li><div class="date">June 9, 2005</div><a href="/templates/story/story.php?storyId=4696372" class="iconlink related">Boxing: From Big-Time to Big Screen</a></li><li><div class="date">Jan. 13, 2004</div><a href="/templates/story/story.php?storyId=1595889" class="iconlink related">Commentary: When Your Neighbor\'s a Champ</a></li></ul><div class="spacer"> </div></div><!-- END CLASS="BUCKETCONTENT" --><div class="bucketbottom"> </div><!-- END CLASS="BUCKETBOTTOM" --></div><!-- END RELATED STORIES -->Copyright 2008 NPR. To see more, visit <a href="http://www.npr.org/">http://www.npr.org/</a>.<a src="http://media.npr.org/images/xanadu.gif?apiKey=MDAwMTIxNjMwMDEyMTQzMzUxNjAzOWRhYQ01" />'
        },
        layout: {
          bottom: { container: { refId: '91281093', num: '1' } }
        }
      }
    ]
  }
};
