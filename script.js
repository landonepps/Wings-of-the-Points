$.ajax({
    url: "local.json",
    success: function(result) {
        console.log(result);
        let remoteNodes = _.map(_.filter(result.rewardPrograms, o => ['HYA', 'IHG', 'HIL', 'CMB-AMEX-PLAT'].indexOf(o.code) === -1), program => {
            let alliance = '';
            if (program.attribute === 'StarAlliance') {
                alliance = 'starAlliance';
            }
            if (program.attribute === 'Oneworld') {
                alliance = 'oneworld';
            }
            if (program.attribute === 'SkyTeam') {
                alliance = 'skyteam';
            }
            let name = program.name;
            if (program.type === 'airline') {
                name += ` [${program.code}]`;
            }
            return {
                alliance,
                sc: program.code.toLowerCase(),
                name,
                id: `${program.code.toLowerCase()}-${program.name}`
            }
        });

        const temp = _.map(_.filter(result.transfers, program => ['SPG', 'MAR', 'CITI', 'AMEX', 'CHASE', 'NA'].indexOf(program.from.code) > -1), transfer => {
            return {
                s: transfer.from.code.toLowerCase(),
                t: transfer.to.code.toLowerCase(),
                type: transfer.to.attribute,
            }
        });

        let nodes = remoteNodes;
        nodes = _.orderBy(nodes, ['alliance', (o) => {
            if (o.name === 'NA') {
                return 'z'
            } else {
                return o.name.slice(0, 5).toLowerCase()
            }
        }], ['asc', 'asc']);

        flatRelations = temp;

        let left = 0;
        let right = 0;

        var links = _.map(flatRelations, o => {
            if (o.type === 'StarAlliance' || o.type === 'Non') {
                left += 1;
                var target = _.findIndex(nodes, oo => oo.sc === o.s);
                var source = _.findIndex(nodes, oo => oo.sc === o.t);
            } else {
                right += 1;
                var source = _.findIndex(nodes, oo => oo.sc === o.s);
                var target = _.findIndex(nodes, oo => oo.sc === o.t);
            }
            var value = 1 / _.filter(flatRelations, oo => oo.t === o.t).length;
            return {
                source,
                target,
                value
            };
        });

        console.log('after links', JSON.parse(JSON.stringify(links)));

        var data = {
            nodes,
            links,
        }

        var spgColor = '#493266';
        var marriottColor = '#D32F2F';
        var amexColor = '#2E7D32';
        var chaseColor = '#1565C0';
        var citiColor = '#FDD835';
        var noneColor = '#CCCCCC';
        var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
        chart
            .colorNodes(function(name, node) {
                if (node.sc === 'spg') {
                    return spgColor;
                }
                if (node.sc === 'mar') {
                    return marriottColor;
                }
                if (node.sc === 'amex') {
                    return amexColor;
                }
                if (node.sc === 'chase') {
                    return chaseColor;
                }
                if (node.sc === 'citi') {
                    return citiColor;
                }
                if (node.sc === 'na') {
                    return noneColor;
                }
            })
            .colorLinks(function(link) {
                if ([link.source.sc, link.target.sc].indexOf('spg') >= 0) {
                    return spgColor;
                }
                if ([link.source.sc, link.target.sc].indexOf('mar') >= 0) {
                    return marriottColor;
                }
                if ([link.source.sc, link.target.sc].indexOf('chase') >= 0) {
                    return chaseColor;
                }
                if ([link.source.sc, link.target.sc].indexOf('citi') >= 0) {
                    return citiColor;
                }
                if ([link.source.sc, link.target.sc].indexOf('amex') >= 0) {
                    return amexColor;
                }
                if ([link.source.sc, link.target.sc].indexOf('none') >= 0) {
                    return noneColor;
                }
            })
            .on("link:mouseover", (link) => {
                var $box = $("#box"),
                    target = link.target,
                    source = link.source;
                if (source.sc === "citi" || source.sc === "amex" || source.sc === "chase" || source.sc === "mar" || source.sc === "spg" || source.sc === "none") {
                    [target, source] = [source, target];
                }
                console.log(source.sc, target.sc);
                let t = _.find(result.transfers, o => o.to.code.toLowerCase() === source.sc && o.from.code.toLowerCase() === target.sc);
                let rate = "?:?";
                if (t && t.ratio) {
                    rate = `1 : ${_.round(t.ratio, 4)}`
                }
                // rate = rates[target.sc] ? (rates[target.sc][source.sc] || "?:?") : "?:?";
                $box.show()
                    .html(`${target.name} <strong>${rate}</strong> ${source.name}`);
                var x = (target.x + target.dx + source.x + source.dx - $box.width()) / 2 + $("#chart").position().left,
                    y = (target.y + target.dy + source.y + source.dy + link.dy - $box.height()) / 2;
                $box.css({
                    top: y + "px",
                    left: x + "px",
                });
            })
            .on("link:mouseout", () => {
                $("#box").hide();
            })
            .nodeWidth(15)
            .nodePadding(3)
            .spread(true)
            .iterations(0)
            .draw(data);

        _.map(remoteNodes, o => {
            const iata = o.sc;
            const dataId = `[data-node-id="${o.id}"]`
            SVG.select(`${dataId} rect.airlineLogo`).fill(SVG('fake').image(`images/cardImages/${o.sc.toUpperCase()}.png`, 15, 15));
            SVG.select(`${dataId} rect.allianceLogo`).fill(SVG('fake').image(`images/wings/${o.alliance}.png`, 15, 15));
        })

    }
});
